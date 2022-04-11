const splitGithubReadmeIntoSections = text => {
  console.log({ text })
  let sections = text.split('# ')
  console.log({ sections })
  sections = sections.map(section => `# ${section}`)
  return sections
}

export default splitGithubReadmeIntoSections
