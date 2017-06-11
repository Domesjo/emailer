module.exports = (params)=>{
  const oneDay =(1000 * 60 * 60 * 24);
  const daySent = new Date() - (oneDay * parseInt(params.daysAgo));
  console.log(new Date(daySent), params.daysAgo, new Date());
  let daysAgo = new Date(daySent).toString().substring(4, 10);
  console.log(parseInt(params.daysAgo) > 7);
  if(parseInt(params.daysAgo) > 7) daysAgo = 'a week ago';
  return `
  Hey ${params.reciver},

  Hope you are having a good week?

  I understand you are in charge of hiring talent at ${params.companyName}.

  I sent over a cover letter and CV for the ${params.role} at ${daysAgo} and I was wondering whether you have had a chance to review my application.

  I'd still be very interested in being part of your team. I have reattached my CV for your reference.

  All the best,
  ${params.name}
  ps. if you had any questions in regards to my credentials, feel free to give me a call on:
  ${params.tel}
  ${params.email}

  `;
};
