const splitGithubReadmeIntoSections = text => {
  let sections = text.split('# ')
  sections = sections.map(section => `# ${section}`)
  return sections
}

export default splitGithubReadmeIntoSections
