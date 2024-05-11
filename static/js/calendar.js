const {
  DateTime,
  Interval,
} = luxon

const dummySales = [
  {
    name: "Test Calendar event",
    image: "/default.jpg",
    desc: "This is a test event that spans multiple months and has a long description. This is AI generated text and is not meant to be read by humans.",
    buying: {
      begin: '2024-04-14',
      end: '2024-05-18',
    },
    shipping: {
      begin: '2024-04-19',
      end: '2024-04-30',
    }
  }
];

const dummyEvents = [
  ...dummySales.flatMap((sale) => {
    return [
      {
        name: sale.name + ' buying',
        start: sale.buying.begin,
        end: sale.buying.end,
        image: sale.image,
        desc: sale.desc,
        type: 'sale',
      },
      {
        name: sale.name + ' shipping',
        start: sale.shipping.begin,
        end: sale.shipping.end,
        image: sale.image,
        desc: sale.desc,
        type: 'shipping',
      }
    ]
  })
];

const slugify = (text) => {
  return text.toLowerCase().replace(/ /g, '-');
}


const findEventsOccuringBetween = (interval) => {
  return dummyEvents
  .map((event) => {
    const eventStart = DateTime.fromISO(event.start);
    const eventEnd = DateTime.fromISO(event.end);
    const containsStart = interval.contains(eventStart);
    const containsEnd = interval.contains(eventEnd);
    const containsBoth = containsStart && containsEnd;
    const length = eventEnd.diff(eventStart, 'days').days;

    return {
      ...event,
      containsStart,
      containsEnd,
      containsBoth,
      length,
    }
  }).filter((event) => {
    return event.containsStart || event.containsEnd || event.containsBoth;
  });
}

const initialRange = Interval.fromDateTimes(
  DateTime.local().minus({months: 6}),
  DateTime.local().plus({months: 5})
)

const MONTH_WIDTH = 70;


const renderCalendar = (range) => {
  const start = range.start.startOf('month');
  const end = range.end.endOf('month');

  const calendarDiv = $('#calendar');
  calendarDiv.empty();
  const DAY_DIV_COUNT = 36;

  // add header row
  const headerRowDiv = $('<div>').addClass('header-row');
  const daysOfWeek = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  // first one is empty
  headerRowDiv.append($('<div>').addClass('month').text(start.toLocaleString({year: 'numeric'})));
  // add DAY_DIV_COUNT amount and loop through daysOfWeek
  for (let i = 0; i < DAY_DIV_COUNT; i++) {
    const dayOfWeek = daysOfWeek[i % 7];
    headerRowDiv.append($('<div>').addClass('day-header').text(dayOfWeek));
  }
  calendarDiv.append(headerRowDiv);


  Interval.fromDateTimes(start, end).splitBy({months: 1}).forEach((interval) => {
    const monthStart = interval.start;
    const monthEnd = interval.end;
    const monthRowDiv = $('<div>').addClass('month-row');
    
    const monthDiv = $('<div>').addClass('month').text(monthStart.toLocaleString({month: 'short', }));
    monthRowDiv.append(monthDiv);

    const monthDayContainer = $('<div>').addClass('month-days');

    
    const DAYS_IN_MONTH = monthStart.daysInMonth;

    const monthStartDayOfWeek = monthStart.weekday;
    const emptyDayDivsStart = monthStartDayOfWeek === 7 ? 0 : monthStartDayOfWeek;
    const emptyDayDivsEnd = DAY_DIV_COUNT - DAYS_IN_MONTH - emptyDayDivsStart;

    for (let i = 0; i < emptyDayDivsStart; i++) {
      monthDayContainer.append($('<div>').addClass('day').addClass('empty'));
    }

    for (let i = 0; i < DAYS_IN_MONTH; i++) {
      const dayText = $('<span>').text(i + 1);
      const dayDiv = $('<div>').addClass('day').append(dayText);

      monthDayContainer.append(dayDiv);
    }

    for (let i = 0; i < emptyDayDivsEnd; i++) {
      monthDayContainer.append($('<div>').addClass('day').addClass('empty'));
    }

    const events = findEventsOccuringBetween(interval);

    events.forEach((event, idx) => {
      const eventDiv = $('<div>').addClass('event').addClass(event.type)
      const eventText = $('<span>').text(event.name);

      const eventLink = $('<a>')
        .attr('rel', 'modal:open')
        .attr('href', '#' + slugify(event.name))
        .append(eventText);

      eventDiv.append(eventLink);
    
      const clippedEnd = event.containsEnd ? DateTime.fromISO(event.end) : monthEnd.minus({days: 1});
      const clippedStart = event.containsStart ? DateTime.fromISO(event.start) : monthStart;
      const eventInterval = Interval.fromDateTimes(clippedStart, clippedEnd);

      
      const day = clippedStart.day;
      const leftPos = `calc(${(emptyDayDivsStart + day - 1) / DAY_DIV_COUNT * 100}% + 2px)`;
      const width = `calc(${(eventInterval.count('days') + 1) / DAY_DIV_COUNT * 100}% - 4px)`;

      eventDiv.css({
        left: leftPos,
        top: `${(idx + 1)* 18}px`,
        width: width,
      });

      if (!event.containsStart) {
        eventDiv.addClass('no-start');
      }
      if (!event.containsEnd) {
        eventDiv.addClass('no-end');
      }

      monthDayContainer.append(eventDiv);
    })

    monthRowDiv.append(monthDayContainer);

    calendarDiv.append(monthRowDiv);

  });

  const modalDiv = $("#modals");
  modalDiv.empty();
  dummyEvents.forEach((event) => {
    const eventDiv = $('<div>').addClass('modal').attr('id', slugify(event.name));
    const eventTitle = $('<h2>').text(event.name);
    const eventDesc = $('<p>').text(event.desc);
    const eventImage = $('<img>').attr('src', event.image);
    console.log(eventImage);
    eventDiv.append(eventTitle);
    eventDiv.append(eventDesc);
    eventDiv.append(eventImage);

    modalDiv.append(eventDiv);
  })

}

renderCalendar(initialRange);
