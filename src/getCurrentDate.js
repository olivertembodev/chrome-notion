const month_names_short = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

function getCurrentDate() {
  let date = new Date()
  return `on ${month_names_short[date.getMonth()]} ${date.getDate()}`
}
