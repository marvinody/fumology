const { DateTime, Interval } = luxon;

const TOTAL_COLORS = 18;

const pickColorClass = (idx) => {
  const count = idx % TOTAL_COLORS;
  return `bg-${count + 1}`;
};

const dummySales = [
  {
    name: "Fumo Sale 2022 #1",
    image: "/images/sales/2022-01.jpg",
    desc: "First time we see a Lost Word collab, giving us Dark Youmu. The sale also included Reimu & Marisa.",
    buying: {
      begin: "2022-05-27",
      end: "2022-06-15",
    },
    shipping: {
      begin: "2022-11-12",
      end: "2022-11-30",
    },
  },
  {
    name: "Fumo Sale 2022 #2",
    image: "/images/sales/2022-02.jpg",
    desc: "Second sale of 2022, featuring Alice, Patchy, Kokoro, and Tenshi.",
    buying: {
      begin: "2022-06-22",
      end: "2022-07-11",
    },
    shipping: {
      begin: "2023-12-10",
      end: "2023-12-31",
    },
  },
  {
    name: "Fumo Sale 2022 #3",
    image: "/images/sales/2022-03.jpg",
    desc: "Third sale of 2022, featuring Deka releases of Youmu, Yuyuko, Remilia, Flandre & Sakuya. This end date isn't correct and went on until no more supplies.",
    buying: {
      begin: "2022-07-27",
      end: "2022-07-31",
    },
    shipping: {
      begin: "2022-10-11",
      end: "2023-10-31",
    },
  },
  {
    name: "Fumo Sale 2022 #4",
    image: "/images/sales/2022-04.jpg",
    desc: "Fourth sale of 2022, featuring Deka releases of Reisen (blazer), Tewi, Kaguya, and Mokou.",
    buying: {
      begin: "2022-08-24",
      end: "2022-09-21",
    },
    shipping: {
      begin: "2023-02-17",
      end: "2023-02-28",
    },
  },
  {
    name: "Fumo Sale 2022 #5",
    image: "/images/sales/2022-05.jpg",
    desc: "Fifth sale of 2022, featuring Youmu, Yuyuko, Shion & Jo'on.",
    buying: {
      begin: "2022-09-28",
      end: "2022-10-26",
    },
    shipping: {
      begin: "2023-03-27",
      end: "2023-04-03",
    },
  },
  {
    name: "Fumo Sale 2022 #6",
    image: "/images/sales/2022-06.jpg",
    desc: "Sixth sale of 2022, featuring Junko, Keiki, Aya, Meiling, Suwako and Mannaka Satori, Koishi, Cirno.",
    buying: {
      begin: "2022-10-24",
      end: "2022-11-21",
    },
    shipping: {
      begin: "2023-04-15",
      end: "2023-04-30",
    },
  },
  {
    name: "Fumo Sale 2022 #7",
    image: "/images/sales/2022-07.jpg",
    desc: "Seventh sale of 2022, featuring Deka releases of Deka releases of Alice, Sanae, Sakuya, Youmu, and Yuyuko.",
    buying: {
      begin: "2022-12-07",
      end: "2022-12-31",
    },
    shipping: {
      begin: "2023-06-13",
      end: "2023-06-20",
    },
  },
  {
    name: "Fumo Sale 2023 #1",
    image: "/images/sales/2023-01.jpg",
    desc: "First sale of 2023, featuring of Sakuya, Remilia, and Flandre.",
    buying: {
      begin: "2023-02-10",
      end: "2023-03-13",
    },
    shipping: {
      begin: "2023-08-24",
      end: "2023-08-31",
    },
  },
  {
    name: "Fumo Sale 2023 #2",
    image: "/images/sales/2023-02.jpg",
    desc: "Second sale of 2023, featuring of Rumia, Eiki, and Nitori.",
    buying: {
      begin: "2023-03-10",
      end: "2023-04-10",
    },
    shipping: {
      begin: "2023-09-20",
      end: "2023-09-30",
    },
  },
  {
    name: "Fumo Sale 2023 #3",
    image: "/images/sales/2023-03.jpg",
    desc: "Third sale of 2023, featuring of Renko, Maribel, Suika, Futo, Seija, Miko, & Mannaka Yuyuko and Youmu.",
    buying: {
      begin: "2023-05-08",
      end: "2023-05-29",
    },
    shipping: {
      begin: "2023-11-21",
      end: "2023-11-30",
    },
  },
  {
    name: "Fumo Sale 2023 #4",
    image: "/images/sales/2023-04.jpg",
    desc: "Fourth sale of 2023, featuring Lost Word recolors of Reimu & Marisa.",
    buying: {
      begin: "2023-07-02",
      end: "2023-08-28",
    },
    shipping: {
      begin: "2024-01-23",
      end: "2024-01-31",
    },
  },
  {
    name: "Fumo Sale 2023 #5",
    image: "/images/sales/2023-05.jpg",
    desc: "Fifth sale of 2023, featuring of Rinnosuke, Yukari & Patchy.",
    buying: {
      begin: "2023-08-10",
      end: "2023-09-14",
    },
    shipping: {
      begin: "2024-02-20",
      end: "2024-02-28",
    },
  },
  {
    name: "Fumo Sale 2023 #6",
    image: "/images/sales/2023-06.jpg",
    desc: "Sixth sale of 2023, featuring of Cirnos, regular + suntanned.",
    buying: {
      begin: "2023-09-01",
      end: "2023-10-02",
    },
    shipping: {
      begin: "2024-04-17",
      end: "2024-04-30",
    },
  },
  {
    name: "Fumo Sale 2023 #7",
    image: "/images/sales/2023-07.jpg",
    desc: "Seventh sale of 2023, featuring of PC98 Reimu & Marisa, Lost Word Remilia, Flandre & other Flandre, and Mannaka Patchy & Alice",
    buying: {
      begin: "2023-11-13",
      end: "2023-12-11",
    },
    shipping: {
      begin: "2024-06-15",
      end: "2024-06-30",
    },
  },
  {
    name: "Fumo Sale 2023 #8",
    image: "/images/sales/2023-08.jpg",
    desc: "Eighth sale of 2023, featuring Satori, Koishi & Sanae.",
    buying: {
      begin: "2023-12-08",
      end: "2024-01-10",
    },
    shipping: {
      begin: "2024-07-10",
      end: "2024-07-31",
    },
  },
  {
    name: "Fumo Sale 2024 #1",
    image: "/images/sales/2024-01.jpg",
    desc: "First sale of 2024, featuring Kasen, Eirin & Yuuka",
    buying: {
      begin: "2024-01-09",
      end: "2024-02-12",
    },
    shipping: {
      begin: "2024-08-10",
      end: "2024-08-31",
    },
  },
  {
    name: "Fumo Sale 2024 #2",
    image: "/images/sales/2024-02.jpg",
    desc: "Second sale of 2024, featuring of Reisen (no blazer), Aya, Hatate, & Momiji",
    buying: {
      begin: "2024-02-09",
      end: "2024-03-11",
    },
    shipping: {
      begin: "2024-09-20",
      end: "2024-09-30",
    },
  },
  {
    name: "Fumo Sale 2024 #3",
    image: "/images/sales/2024-03.jpg",
    desc: "Third sale of 2024, featuring of Parsee, Orin, Okuu, Kogasa, Nue, & Sagume, and Mannaka Remilia, Flandre, & Sakuya.",
    buying: {
      begin: "2024-05-07",
      end: "2024-06-10",
    },
    shipping: {
      begin: "2024-11-20",
      end: "2024-11-30",
    },
  },
];

const dummyEvents = [
  ...dummySales.flatMap((sale, idx) => {
    return [
      {
        name: sale.name + " - Buying",
        start: sale.buying.begin,
        end: sale.buying.end,
        image: sale.image,
        desc: sale.desc,
        type: "sale",
        idx,
      },
      {
        name: sale.name + " - Shipping",
        start: sale.shipping.begin,
        end: sale.shipping.end,
        image: sale.image,
        desc: sale.desc,
        type: "shipping",
        idx,
      },
    ];
  }),
];

const slugify = (text) => {
  return text.toLowerCase().replace(/ /g, "-").replace(/#/g, "");
};

const findEventsOccuringBetween = (interval) => {
  return dummyEvents
    .map((event) => {
      const eventStart = DateTime.fromISO(event.start);
      const eventEnd = DateTime.fromISO(event.end);
      const containsStart = interval.contains(eventStart);
      const containsEnd = interval.contains(eventEnd);
      const containsBoth = containsStart && containsEnd;
      const length = eventEnd.diff(eventStart, "days").days;

      return {
        ...event,
        containsStart,
        containsEnd,
        containsBoth,
        length,
      };
    })
    .filter((event) => {
      return event.containsStart || event.containsEnd || event.containsBoth;
    });
};

const initialRange = Interval.fromDateTimes(
  DateTime.local().minus({ months: 6 }),
  DateTime.local().plus({ months: 5 })
);

let currentRange = initialRange;

const MONTH_WIDTH = 70;

const renderCalendar = (range) => {
  const start = range.start.startOf("month");
  const end = range.end.endOf("month");

  const calendarDiv = $("#calendar");
  calendarDiv.empty();
  const DAY_DIV_COUNT = 36;

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

      const events = findEventsOccuringBetween(interval);

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
        const leftPos = `calc(${
          ((emptyDayDivsStart + day - 1) / DAY_DIV_COUNT) * 100
        }% + 2px)`;
        const width = `calc(${
          ((eventInterval.count("days") + 1) / DAY_DIV_COUNT) * 100
        }% - 4px)`;

        eventDiv.css({
          left: leftPos,
          top: `${(idx + 1) * 18}px`,
          width: width,
        });

        if (!event.containsStart) {
          eventDiv.addClass("no-start");
        }
        if (!event.containsEnd) {
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
    const eventDesc = $("<p>").text(event.desc);
    const eventImage = $("<img>").attr("src", event.image);
    const dateDiv = $("<div>");

    const buyingBegin = DateTime.fromISO(event.buying.begin);
    const buyingEnd = DateTime.fromISO(event.buying.end);

    const now = DateTime.local();
    const endOfMonth = DateTime.fromISO(event.shipping.end).endOf("month");

    const diff = endOfMonth.diff(now, "days");

    const lateMonthText = `Late ${endOfMonth.monthLong}`;

    const relativeAway = endOfMonth.toRelative();

    const shipText =
      diff.days < 0
        ? `Shipped: ${lateMonthText} (Approximately ${relativeAway})`
        : `Shipping: ${lateMonthText} (Approximately ${relativeAway})`;

    // Create paragraph elements
    const buyingDateText = $("<p>").text(
      `Buying: ${buyingBegin.toLocaleString(
        DateTime.DATE_FULL
      )} - ${buyingEnd.toLocaleString(DateTime.DATE_FULL)}`
    );
    const shippingDateText = $("<p>").text(shipText);

    dateDiv.append(buyingDateText);
    dateDiv.append(shippingDateText);

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
  }

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
      updateHeaderTitle(currentRange)
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

$(document).ready(() => {
  renderCalendar(initialRange);
  renderHeaderUI();
});
