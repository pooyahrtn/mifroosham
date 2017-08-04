export function getRemainingTimeText(endsInTime){
  remaining_secs = endsInTime - new Date().getTime()/1000;
  if (remaining_secs <= 0) {
    return {text: 'مهلت تمام شد.',enabled: false};
  }
  let days= Math.floor(remaining_secs / (60 * 60 * 24));
  let hours= Math.floor(remaining_secs/ (60*60) - 24 * days);
  let mins = Math.floor(remaining_secs/ 60 - hours* 60 - 24 * 60 * days);
  let secs = Math.floor((remaining_secs - hours * 60 * 60 - mins * 60 - 24 * 60 * 60 * days));
  time = '';
  if (days> 0) {
    time =  days+ ':' +hours + ':' + mins+ ':' + secs ;
  }else if (hours > 0) {
    time = hours + ':' + mins+ ':' + secs;
  }else if (mins > 0) {
    time = mins + ':' + secs;
  }else {
    time = secs;
  }
  return {text: time, enabled: true}
}

export function getTimeAgo(postTime){
  let passedTime = (new Date().getTime()/1000) - postTime;

  let months = Math.floor(passedTime/ (60 * 60 * 24 * 30))
  if (months > 0) {
    return months + ' ماه پیش';
  }
  let days= Math.floor(passedTime / (60 * 60 * 24));
  if (days > 0) {
    return days + ' روز پیش';
  }
  let hours= Math.floor(passedTime/ (60*60));
  if (hours > 0) {
    return hours + ' ساعت پیش';
  }
  let mins = Math.floor(passedTime/ 60 - hours* 60 - 24 * 60 * days);
  if (mins > 0) {
    return mins + ' دقیقه پیش';
  }
  let secs = Math.floor((passedTime - hours * 60 * 60 - mins * 60 - 24 * 60 * 60 * days));
  return secs + ' ثانیه پیش';
}
