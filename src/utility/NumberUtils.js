export function  EnglighNumberToPersian (englishNumber)  {
  if (englishNumber == 0) {
    return ' '
  }
  id= ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
  var englishNumber = String(englishNumber).toLocaleString();;
  for (var i = 0; i <= 9; i++) {
    while (englishNumber.indexOf(i) > -1) {
      englishNumber = englishNumber.replace(i, id[i]);
    }
  }
  return englishNumber;
  // return String(englishNumbertoLocaleString('ar-EG');
}

export function EnglishNumberToPersianPrice(englishNumber){
  persianNumber = EnglighNumberToPersian(englishNumber);

  commaIndex = persianNumber.length - 3;
  while (commaIndex > 0) {
    firstPart = persianNumber.substring(0, commaIndex)
    secondPart = persianNumber.substring(commaIndex)
    persianNumber = firstPart + ',' + secondPart
    commaIndex = commaIndex - 3
  }
  persianNumber = persianNumber
  return persianNumber;
}

export function countText(count){
  id= ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
  leftNumber = count;

  scale = ''
  if (leftNumber > 1000000) {
    leftNumber = Math.floor(leftNumber/1000000);
    scale = 'م'
  }else if (leftNumber > 1000) {
    leftNumber = Math.floor(leftNumber / 1000);
    scale = 'ک'
  }
  res = '';
  for (var i = 10; leftNumber > 0 ; ) {
    res = (id[leftNumber % 10]) + res ;
    leftNumber = Math.floor(leftNumber / 10)
  }
  return res + ' '+scale
}
