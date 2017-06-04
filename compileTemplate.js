module.exports = function(params) {
  return `Dear ${params.reciver},

I wanted to get in touch about the ${params.role} role to join your team here in
${params.city}.

I find ${params.companyName} is doing some ground-breaking and interesting work in the ${params.sector}.

I have just graduated from a immersive program at General Assembly in Web Development. I enjoy working with different frameworks and libraries both on the back-end and front-end, I have experience using ${params.framework} which I find very interesting to use.

I read in your Job description you use ${params.companyLanguage} on the back end, this is something I'd love to work with and learn as an addition to my skillset.

My CV is attached to this application. Here is a link to my portfolio ${params.cv}
If there is any questions please do not hesitate to contact me, I’d love to resolve any uncertainties.

Sincerely yours,
${params.name}

${params.email}
${params.tel}`;

};
