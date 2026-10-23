// Body of one section card, shared by the bubble panel and the fallback page.
export default function SectionContent({ section, headingLevel = 'h2', headingId }) {
  const Heading = headingLevel;

  return (
    <>
      {section.kicker && <p className="card__kicker">{section.kicker}</p>}
      <Heading id={headingId} className="card__title">{section.title}</Heading>
      {section.school && <p className="card__school">{section.school}</p>}
      {section.summary && <p className="card__summary">{section.summary}</p>}

      {section.stack && (
        <ul className="card__chips" aria-label="Tech stack">
          {section.stack.map((item) => <li key={item} className="chip">{item}</li>)}
        </ul>
      )}

      {section.highlights && (
        <ul className="card__list">
          {section.highlights.map((item) => <li key={item}>{item}</li>)}
        </ul>
      )}

      {section.groups && (
        <dl className="card__groups">
          {section.groups.map((group) => (
            <div key={group.name} className="card__group">
              <dt>{group.name}</dt>
              <dd>
                <ul className="card__chips">
                  {group.items.map((item) => <li key={item} className="chip">{item}</li>)}
                </ul>
              </dd>
            </div>
          ))}
        </dl>
      )}

      {section.link && (
        <a className="card__link" href={section.link.href} target="_blank" rel="noopener noreferrer">
          {section.link.text}
          <span aria-hidden="true"> →</span>
        </a>
      )}
    </>
  );
}
