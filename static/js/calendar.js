const { DateTime, Interval } = luxon;

const TOTAL_COLORS = 18;

const pickColorClass = (idx) => {
  const count = idx % TOTAL_COLORS;
  return `bg-${count + 1}`;
};

const dummySales = window.dummySales || [];

let dummyEvents = [
  ...dummySales.flatMap((sale, idx) => {
    const events = [];
    if (sale?.buying) {
      events.push({
        name: sale.name + " - Buying",
        start: sale.buying.begin,
        end: sale.buying.end,
        image: sale.image,
        desc: sale.desc,
        type: "sale",
        show: true,
        idx,
      });
    }
    if (sale?.shipping) {
      events.push({
        name: sale.name + " - Shipping",
        start: sale.shipping.begin,
        end: sale.shipping.end,
        image: sale.image,
        desc: sale.desc,
        type: "shipping",
        show: true,
        idx,
      });
    }
    return events;
  }),
];

const slugify = (text) => {
  return text.toLowerCase().replace(/ /g, "-").replace(/#/g, "");
};

const parseDescLines = (desc) => {
  if (!desc) {
    return [];
  }

  return desc
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
};

const renderDesc = (desc) => {
  const lines = parseDescLines(desc);

  if (lines.length <= 1) {
    return $("<p>").text(lines[0] || "");
  }

  const list = $("<ul>").addClass("event-desc-list");
  lines.forEach((line) => {
    list.append($("<li>").text(line));
  });

  return list;
};

const findEventsOccuringBetween = (interval) => {
  return dummyEvents
    .map((event) => {
      const eventStart = DateTime.fromISO(event.start);
      const eventEnd = DateTime.fromISO(event.end);
      const containsStart = interval.contains(eventStart);
      const containsEnd = interval.contains(eventEnd);
      const containsBoth = containsStart && containsEnd;
      const containedWithinEvent = Interval.fromDateTimes(eventStart, eventEnd).overlaps(interval);
      const length = eventEnd.diff(eventStart, "days").days;

      return {
        ...event,
        containsStart,
        containsEnd,
        containsBoth,
        containedWithinEvent,
        length,
      };
    })
    .filter((event) => {
      return (
        event.containsStart ||
        event.containsEnd ||
        event.containsBoth ||
        event.containedWithinEvent
      );
    });
};

const initialRange = Interval.fromDateTimes(
  DateTime.local().minus({ months: 3 }),
  DateTime.local().plus({ months: 2 })
);

let currentRange = initialRange;

const MONTH_WIDTH = 70;

// generally, this will be 36, but in some cases it can be 37
// this is just to know how many empty start and end divs to add to pad everything
const determineMaxDayCount = (start, end) => {
  let maxDayCount = 0;
  Interval.fromDateTimes(start, end)
    .splitBy({ months: 1 })
    .forEach((interval) => {
      const daysInMonth = interval.start.daysInMonth;
      const dayOfWeek = interval.start.weekday % 7;
      maxDayCount = Math.max(maxDayCount, daysInMonth + dayOfWeek);
    });

  return maxDayCount;
}

const renderCalendar = (range) => {
  const start = range.start.startOf("month");
  const end = range.end.endOf("month");

  const calendarDiv = $("#calendar");
  calendarDiv.empty();
  const DAY_DIV_COUNT = determineMaxDayCount(start, end);

  // add header row
  const headerRowDiv = $("<div>").addClass("header-row");
  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // first one is empty
  headerRowDiv.append(
    $("<div>")
      .addClass("month")
      .text(start.toLocaleString({ year: "numeric" }))
  );
  // add DAY_DIV_COUNT amount and loop through daysOfWeek
  for (let i = 0; i < DAY_DIV_COUNT; i++) {
    const dayOfWeek = daysOfWeek[i % 7];
    headerRowDiv.append($("<div>").addClass("day-header").text(dayOfWeek));
  }
  calendarDiv.append(headerRowDiv);

  const today = DateTime.now();

  Interval.fromDateTimes(start, end)
    .splitBy({ months: 1 })
    .forEach((interval) => {
      const monthStart = interval.start;
      const monthEnd = interval.end;
      const monthRowDiv = $("<div>").addClass("month-row");

      const monthDiv = $("<div>")
        .addClass("month")
        .text(monthStart.toLocaleString({ month: "short" }));
      monthRowDiv.append(monthDiv);

      const monthDayContainer = $("<div>").addClass("month-days");

      const DAYS_IN_MONTH = monthStart.daysInMonth;

      const monthStartDayOfWeek = monthStart.weekday;
      const emptyDayDivsStart =
        monthStartDayOfWeek === 7 ? 0 : monthStartDayOfWeek;
      const emptyDayDivsEnd = DAY_DIV_COUNT - DAYS_IN_MONTH - emptyDayDivsStart;

      for (let i = 0; i < emptyDayDivsStart; i++) {
        monthDayContainer.append($("<div>").addClass("day").addClass("empty"));
      }

      for (let i = 0; i < DAYS_IN_MONTH; i++) {
        const dayText = $("<span>").text(i + 1);
        const dayDiv = $("<div>").addClass("day").append(dayText);

        // check if today matches year, month, and day
        const sameYear = today.year === monthStart.year;
        const sameMonth = today.month === monthStart.month;
        const sameDay = today.day === i + 1;

        if (sameYear && sameMonth && sameDay) {
          dayDiv.addClass("today");
        }

        monthDayContainer.append(dayDiv);
      }

      for (let i = 0; i < emptyDayDivsEnd; i++) {
        monthDayContainer.append($("<div>").addClass("day").addClass("empty"));
      }

      const events = findEventsOccuringBetween(interval).filter(event => event.show);

      events.forEach((event, idx) => {
        const eventDiv = $("<div>").addClass("event").addClass(event.type);
        const eventText = $("<span>").text(event.name);

        const eventLink = $("<a>")
          .attr("rel", "modal:open")
          .attr("href", "#sale-" + event.idx)
          .append(eventText);

        eventDiv.addClass(pickColorClass(event.idx));

        eventDiv.append(eventLink);

        const clippedEnd = event.containsEnd
          ? DateTime.fromISO(event.end)
          : monthEnd.minus({ days: 1 });
        const clippedStart = event.containsStart
          ? DateTime.fromISO(event.start)
          : monthStart;
        const eventInterval = Interval.fromDateTimes(clippedStart, clippedEnd);

        const day = clippedStart.day;
        const leftPos = `calc(${((emptyDayDivsStart + day - 1) / DAY_DIV_COUNT) * 100
          }% + 2px)`;
        const width = `calc(${((eventInterval.count("days") + 1) / DAY_DIV_COUNT) * 100
          }% - 4px)`;

        eventDiv.css({
          left: leftPos,
          top: `${(idx + 1) * 24}px`,
          width: width,
        });

        if (!event.containsStart && event.containedWithinEvent) {
          eventDiv.addClass("no-start");
        }
        if (!event.containsEnd && event.containedWithinEvent) {
          eventDiv.addClass("no-end");
        }

        monthDayContainer.append(eventDiv);
      });

      monthRowDiv.append(monthDayContainer);

      calendarDiv.append(monthRowDiv);
    });

  const modalDiv = $("#modals");
  modalDiv.empty();
  dummySales.forEach((event, idx) => {
    const eventDiv = $("<div>")
      .addClass("modal")
      .attr("id", "sale-" + idx);
    const eventTitle = $("<h2>").text(event.name);
    const eventDesc = renderDesc(event.desc);
    const eventImage = $("<img>").attr("src", event.image);
    const dateDiv = $("<div>");

    const buyingBegin = DateTime.fromISO(event.buying.begin);
    const buyingEnd = DateTime.fromISO(event.buying.end);

    const buyingDateText = $("<p>").text(
      `Buying: ${buyingBegin.toLocaleString(
        DateTime.DATE_FULL
      )} - ${buyingEnd.toLocaleString(DateTime.DATE_FULL)}`
    );
    dateDiv.append(buyingDateText);

    const now = DateTime.local();
    if (event?.shipping) {
      const shippingEndDate = DateTime.fromISO(event.shipping.begin);

      const diff = shippingEndDate.diff(now, "days");

      const relativeAway = shippingEndDate.toRelative();

      const shipText =
        diff.days < 0
          ? `Invoices began on: ${shippingEndDate.toLocaleString(DateTime.DATE_FULL)} (Approximately ${relativeAway})`
          : `Invoices begin on: ${shippingEndDate.toLocaleString(DateTime.DATE_FULL)} (Approximately ${relativeAway})`;

      const shippingDateText = $("<p>").text(shipText);

      dateDiv.append(shippingDateText);
    } else {
      dateDiv.append($("<p>").text("Shipping: TBA"));
    }


    eventDiv.append(eventTitle);
    eventDiv.append(eventDesc);
    eventDiv.append(dateDiv);
    eventDiv.append(eventImage);

    modalDiv.append(eventDiv);
  });
};

const renderHeaderUI = () => {
  const headerDiv = $("#header-ui");
  const titleDiv = $("<div>").addClass("title");
  const headerTitle = $("<p>").text("Fumo Calendar");
  titleDiv.append(headerTitle);
  const updateHeaderTitle = (range) => {
    headerTitle.text(
      `Fumo Calendar [${range.start.toLocaleString({
        month: "long",
        year: "numeric",
      })} - ${range.end.toLocaleString({ month: "long", year: "numeric" })}]`
    );
  };

  updateHeaderTitle(currentRange);
  const buttonDiv = $("<div>").addClass("button-group");
  const prevButton = $("<button>")
    .text("<")
    .click(() => {
      const newRange = Interval.fromDateTimes(
        currentRange.start.minus({ months: 1 }),
        currentRange.end.minus({ months: 1 })
      );
      currentRange = newRange;
      renderCalendar(newRange);
      updateHeaderTitle(currentRange);
    });
  const nextButton = $("<button>")
    .text(">")
    .click(() => {
      const newRange = Interval.fromDateTimes(
        currentRange.start.plus({ months: 1 }),
        currentRange.end.plus({ months: 1 })
      );
      currentRange = newRange;
      renderCalendar(newRange);
      updateHeaderTitle(currentRange);
    });
  const todayButton = $("<button>")
    .text("Today")
    .click(() => {
      currentRange = initialRange;
      renderCalendar(initialRange);
      updateHeaderTitle(currentRange);
    });

  const eventCopy = [...dummyEvents].sort((a, b) => {
    return DateTime.fromISO(a.start) - DateTime.fromISO(b.start);
  });
  const firstEvent = eventCopy[0];
  const lastEvent = eventCopy[eventCopy.length - 1];

  const goToFirstButton = $("<button>")
    .text("|<")
    .click(() => {
      const newRange = Interval.fromDateTimes(
        DateTime.fromISO(firstEvent.start),
        DateTime.fromISO(firstEvent.start).plus({ months: 11 })
      );
      currentRange = newRange;
      renderCalendar(newRange);
      updateHeaderTitle(currentRange);
    });

  const goToLastButton = $("<button>")
    .text(">|")
    .click(() => {
      const newRange = Interval.fromDateTimes(
        DateTime.fromISO(lastEvent.start).minus({ months: 11 }),
        DateTime.fromISO(lastEvent.start)
      );
      currentRange = newRange;
      renderCalendar(newRange);
      updateHeaderTitle(currentRange);
    });

  buttonDiv.append(goToFirstButton);
  buttonDiv.append(prevButton);
  buttonDiv.append(todayButton);
  buttonDiv.append(nextButton);
  buttonDiv.append(goToLastButton);

  headerDiv.append(buttonDiv);
  headerDiv.append(titleDiv);
};

const pullUniqueCharacters = () => {
  const chars = new Set();
  dummySales.forEach((sale) => {
    sale.merch?.forEach((item) => {
      item.chars?.forEach((char) => {
        if (char?.name) {
          chars.add(char.name);
        } else if (typeof char === "string") {
          chars.add(char);
        }
      });
    });
  });
  return Array.from(chars).sort();
};

const pullUniquePlushTypes = () => {
  const types = new Set();
  dummySales.forEach((sale) => {
    sale.merch?.forEach((item) => {
      if (item.type) {
        types.add(item.type);
      }
    });
  });
  return Array.from(types).sort();
};
console.log("Unique characters:", pullUniqueCharacters());
console.log("Unique plush types:", pullUniquePlushTypes());

const FILTER_CONFIG = [
  {
    id: "plush-types",
    label: "Plush Types",
    options: pullUniquePlushTypes(),
  },
  {
    id: "event-type",
    label: "Event Type",
    options: ["MTO", "Buying", "Shipping"],
  },
  {
    id: "characters",
    label: "Characters",
    options: pullUniqueCharacters(),
  },
];

const matchesCharacterFilter = (sale, activeFilters) => {
  const characterFilters = activeFilters["characters"];
  if (characterFilters.length === 0) {
    return true;
  }
  const merchChars = sale.merch.flatMap((item) => item.chars || []);
  return merchChars.some((char) => characterFilters.includes(char?.name || char));
};

const matchesPlushTypeFilter = (sale, activeFilters) => {
  const plushTypeFilters = activeFilters["plush-types"];
  if (plushTypeFilters.length === 0) {
    return true;
  }
  const merchTypes = sale.merch.map((item) => item.type);
  return merchTypes.some((type) => plushTypeFilters.includes(type));
};

const matchesEventTypeFilter = (event, activeFilters) => {
  const eventTypeFilters = activeFilters["event-type"];
  if (eventTypeFilters.length === 0) {
    return true;
  }
  const sale = dummySales[event.idx];
  const requiresMTO = eventTypeFilters.includes("MTO");
  const hasMTO = sale.merch.some((item) => item.MTO);
  if (event.name.includes("with seat")) {
    console.log({
      eventName: event.name,
      requiresMTO,
      hasMTO,
    })
  }

  if (eventTypeFilters.includes("Buying") && event.type === "sale") {
    return requiresMTO ? hasMTO : true;
  } else if (eventTypeFilters.includes("Shipping") && event.type === "shipping") {
    return requiresMTO ? hasMTO : true;
  } else if (requiresMTO) {
    return hasMTO;
  }
  return false;
};

const applyFilters = () => {
  const activeFilters = {};
  FILTER_CONFIG.forEach((section) => {
    const checked = [];
    $(`#filter-section-${section.id} input[type="checkbox"]:checked`).each(
      function () {
        checked.push($(this).val());
      }
    );
    activeFilters[section.id] = checked;
  });

  // TODO: Apply activeFilters to calendar items
  console.log("Active filters:", activeFilters);
  dummyEvents = dummyEvents.map((event) => {
    const sale = dummySales[event.idx];
    if (!sale) {
      return { ...event, show: false };
    }

    const matchesPlushType = matchesPlushTypeFilter(sale, activeFilters);
    const matchesCharacter = matchesCharacterFilter(sale, activeFilters);
    const matchesEventType = matchesEventTypeFilter(event, activeFilters);

    console.log({
      event: event.name,
      matchesPlushType,
      matchesCharacter,
      matchesEventType,
    })

    return {
      ...event,
      show: matchesPlushType && matchesCharacter && matchesEventType
    }
  });
  console.log("After filtering:", dummyEvents);

  renderCalendar(currentRange);
};

const renderFilters = () => {
  const filtersDiv = $("#calendar-filters");
  filtersDiv.empty();

  const searchInput = $("<input>")
    .attr("type", "text")
    .attr("placeholder", "Search filters...")
    .addClass("filter-search");

  searchInput.on("keyup", function () {
    const query = $(this).val().toLowerCase();
    filtersDiv.find(".filter-option").each(function () {
      const text = $(this).text().toLowerCase();
      $(this).toggleClass("filter-hidden", query.length > 0 && !text.includes(query));
    });
  });

  filtersDiv.append(searchInput);

  FILTER_CONFIG.forEach((section) => {
    const details = $("<details>").attr("open", true).attr("id", `filter-section-${section.id}`);
    const summary = $("<summary>").text(section.label);
    details.append(summary);

    const optionsList = $("<div>").addClass("filter-options-list");

    section.options.forEach((option) => {
      const label = $("<label>").addClass("filter-option");
      const checkbox = $("<input>")
        .attr("type", "checkbox")
        .attr("value", option)
        .attr("name", section.id);

      checkbox.on("change", applyFilters);

      label.append(checkbox);
      label.append($("<span>").text(option));
      optionsList.append(label);
    });

    details.append(optionsList);
    filtersDiv.append(details);
  });
};

$(document).ready(() => {
  renderFilters();
  renderCalendar(initialRange);
  renderHeaderUI();
});