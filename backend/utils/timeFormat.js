const getCourseStatus = (startTime, endTime) => {
  const now = new Date();
  let status;
  if (now < startTime) status = '尚未開始';
  else if (now <= endTime) status = '進行中';
  else status = '已結束';

  return status
}

module.exports = { getCourseStatus };