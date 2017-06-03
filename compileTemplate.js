
module.exports = function(params) {
  return `${params.reciver},

I wanted to get in touch about the ${params.role} role to join your team here in ${params.city}.
I find ${params.companyName} is doing some ground breaking work in ${params.sector}, which is super exciting.

${params.paragraph}

I have just graduated from a immersive program at General Assembly in Web Development. I enjoy working with different frameworks and libraries both on the back-end and front-end, I have experience using ${params.framework} which I both find very interesting to use. I find ${params.favouriteFramework} slightly more enjoyable because of it is less naming conventions and opinionated.
Overall I find back-end problems more appealing because making these to work, and interact with each other feels super rewarding.

I read in your Job description you use ${params.companyLanguage} on the back end, this is something I'd love to start learning and learn as an addition to my skillset.

My CV is attached to this application.
Here is a link to my portfolio
samdomesjo.com

If there is any questions please do not hesitate to contact me, I’d love to resolve any uncertainties.
Sincerely yours,

${params.name}
${params.email}
${params.tel}
`;
};
