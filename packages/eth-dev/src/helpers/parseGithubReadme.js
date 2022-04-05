const parseGithubReadme = text =>
  text
    .replace('# 🏗 scaffold-eth | 🏰 BuidlGuidl', '')
    .replace(/🏆.*?🍾/g, '')
    .replace(/🎖.*?🎖/g, '')

export default parseGithubReadme
