const Skills = props => {
  const {skill} = props
  const {name, imageUrl} = skill
  return (
    <li>
      <div>
        <img src={imageUrl} alt={name} />
        <p>{name}</p>
      </div>
    </li>
  )
}
export default Skills
