const {
  DateTime,
  Interval,
} = luxon

const initialRange = Interval.fromDateTimes(
  DateTime.local().minus({months: 6}),
  DateTime.local().plus({months: 6})
)

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
    headerRowDiv.append($('<div>').addClass('day').text(dayOfWeek));
  }
  calendarDiv.append(headerRowDiv);


  const months = Interval.fromDateTimes(start, end).splitBy({months: 1}).forEach((interval) => {
    const monthStart = interval.start;
    const monthEnd = interval.end;
    const monthRowDiv = $('<div>').addClass('month-row');
    
    const monthDiv = $('<div>').addClass('month').text(monthStart.toLocaleString({month: 'short', }));
    monthRowDiv.append(monthDiv);

    
    const DAYS_IN_MONTH = monthStart.daysInMonth;


    const monthStartDayOfWeek = monthStart.weekday;
    const emptyDayDivsStart = monthStartDayOfWeek === 7 ? 0 : monthStartDayOfWeek;
    const emptyDayDivsEnd = DAY_DIV_COUNT - DAYS_IN_MONTH - emptyDayDivsStart;

    for (let i = 0; i < emptyDayDivsStart; i++) {
      monthRowDiv.append($('<div>').addClass('day').addClass('empty'));
    }

    for (let i = 0; i < DAYS_IN_MONTH; i++) {
      const dayText = $('<span>').text(i + 1);
      monthRowDiv.append($('<div>').addClass('day').append(dayText));
    }

    for (let i = 0; i < emptyDayDivsEnd; i++) {
      monthRowDiv.append($('<div>').addClass('day').addClass('empty'));
    }

    // const days = Interval.fromDateTimes(monthStart.startOf('month'), monthStart.endOf('month')).splitBy({days: 1}).forEach((interval) => {
    //   const day = interval.start;

    //   // return {
    //   //   day: day,
    //   //   dayOfMonth: day.day,
    //   //   dayOfWeek: day.weekday,
    //   //   month: day.month,
    //   //   year: day.year,
    //   //   isToday: DateTime.local().hasSame(day, 'day'),
    //   // }

    //   const dayDiv = $('<div>').addClass('day').text(day.day);
    //   monthRowDiv.append(dayDiv);
    // });


    calendarDiv.append(monthRowDiv);

  });

}

renderCalendar(initialRange);
