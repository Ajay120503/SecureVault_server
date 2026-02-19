const categories = {
  Social: ["facebook", "instagram", "twitter", "linkedin", "reddit", "discord"],
  Development: ["github", "gitlab", "bitbucket", "stackoverflow"],
  Google: ["google", "gmail", "youtube"],
  Banking: ["sbi", "hdfc", "icici", "axisbank", "paytm", "phonepe", "gpay"],
  Shopping: ["amazon", "flipkart", "myntra", "meesho"],
  Entertainment: ["netflix", "primevideo", "spotify", "hotstar"],
  Cloud: ["dropbox", "drive", "onedrive", "icloud"]
};

function normalizeSite(site) {
  return site
    .toLowerCase()
    .replace(/^https?:\/\//, "") // remove protocol
    .replace(/^www\./, "")       // remove www
    .split("/")[0];              // keep domain only
}

module.exports = (site) => {
  const cleanSite = normalizeSite(site);

  for (const category in categories) {
    if (categories[category].some(keyword =>
      cleanSite.includes(keyword)
    )) {
      return category;
    }
  }

  return "General";
};
