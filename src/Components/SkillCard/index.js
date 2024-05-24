const SkillCard = props => {
  const {skillDetails} = props
  const {imageUrl, name} = skillDetails
  return (
    <li>
      <div>
        <img src={imageUrl} alt={name} />
        <p>{name}</p>
      </div>
    </li>
  )
}
export default SkillCard
