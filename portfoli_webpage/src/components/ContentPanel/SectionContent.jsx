import MergeSortDemo from '../MergeSortDemo/MergeSortDemo';

// Body of one section card, shared by the bubble panel and the fallback page.
export default function SectionContent({ section, headingLevel = 'h2', headingId }) {
  const Heading = headingLevel;
  // Projects inside a section get the next heading level down
  const SubHeading = `h${Math.min(Number(headingLevel.slice(1)) + 1, 6)}`;

  return (
    <>
      {section.kicker && <p className="card__kicker">{section.kicker}</p>}
      {/* With an id the heading can take focus, so it's read out when the section opens */}
      <Heading id={headingId} tabIndex={headingId ? -1 : undefined} className="card__title">{section.title}</Heading>
      {section.summary && <p className="card__summary">{section.summary}</p>}

      {section.stack && (
        <ul className="card__chips" aria-label="Tech stack">
          {section.stack.map((item) => <li key={item} className="chip">{item}</li>)}
        </ul>
      )}

      {section.demo === 'parallel-merge-sort' && <MergeSortDemo />}

      {section.highlights && (
        <ul className="card__list">
          {section.highlights.map((item) => <li key={item}>{item}</li>)}
        </ul>
      )}

      {section.jobs && (
        <ul className="card__degrees">
          {section.jobs.map((job) => (
            <li key={job.company} className="card__degree">
              <p className="card__school">{job.company}</p>
              <p className="card__degree-name">{job.role}</p>
              <ul className="card__chips card__job-stack" aria-label="Tech stack">
                {job.stack.map((item) => <li key={item} className="chip">{item}</li>)}
              </ul>
              <ul className="card__list">
                {job.highlights.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </li>
          ))}
        </ul>
      )}

      {section.projects && (
        <ul className="card__projects">
          {section.projects.map((project) => (
            <li key={project.name} className="card__project">
              <SubHeading className="card__project-name">{project.name}</SubHeading>
              {project.context && <p className="card__degree-name">{project.context}</p>}
              <ul className="card__chips card__job-stack" aria-label={`${project.name} tech stack`}>
                {project.stack.map((item) => <li key={item} className="chip">{item}</li>)}
              </ul>
              <p className="card__summary">{project.summary}</p>
              <ul className="card__list">
                {project.highlights.map((item) => <li key={item}>{item}</li>)}
              </ul>
              {project.link && (
                <a className="card__link" href={project.link.href} target="_blank" rel="noopener noreferrer">
                  {project.link.text}
                  <span className="visually-hidden"> for {project.name}</span>
                  <span aria-hidden="true"> →</span>
                </a>
              )}
            </li>
          ))}
        </ul>
      )}

      {section.groups && (
        <dl className="card__groups">
          {section.groups.map((group) => (
            <div key={group.name} className="card__group">
              <dt>{group.name}</dt>
              <dd>
                {/* A skill is a plain name, or { name, where } when it says where it was used */}
                {group.items.every((item) => typeof item === 'string') ? (
                  <ul className="card__chips">
                    {group.items.map((item) => <li key={item} className="chip">{item}</li>)}
                  </ul>
                ) : (
                  <ul className="card__skills">
                    {group.items.map((item) => (
                      <li key={item.name} className="card__skill">
                        <span className="chip">{item.name}</span>
                        <span className="card__skill-where">{item.where}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </dd>
            </div>
          ))}
        </dl>
      )}

      {section.degrees && (
        <ul className="card__degrees">
          {section.degrees.map((item) => (
            <li key={item.school} className="card__degree">
              <p className="card__school">{item.school}</p>
              <p className="card__degree-name">{item.degree}</p>
              {item.note && <span className="chip">{item.note}</span>}
              {item.honors && (
                <ul className="card__honors" aria-label="Honors">
                  {item.honors.map((honor) => <li key={honor}>{honor}</li>)}
                </ul>
              )}
              {item.coursework && (
                <>
                  <p className="card__subhead">Relevant coursework</p>
                  <ul className="card__chips">
                    {item.coursework.map((course) => <li key={course} className="chip">{course}</li>)}
                  </ul>
                </>
              )}
            </li>
          ))}
        </ul>
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
