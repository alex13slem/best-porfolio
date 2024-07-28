import {
  useRef,
  type ComponentProps,
  type FC,
  type HTMLAttributes,
} from 'react';
import { addProtocolToUrl, cn, triggerMouseEvent } from '@/lib/utils';
import type { SelectProjectTransformed } from '@/schemas/db/projects';
import dispImg from '@/assets/img/displacement4.png';
import { Icon } from '@iconify-icon/react';
import HoverEffectImage from './hover-effect-image';

interface Props
  extends ComponentProps<FC>,
    HTMLAttributes<HTMLDivElement> {
  project: SelectProjectTransformed;
}

const ProjectCard: FC<Props> = ({ className, project, ...props }) => {
  const {
    name,
    technologies,
    slug,
    role,
    githubLink,
    thumbnailGreeting,
    thumbnailPreview,
  } = project;
  const formattedGithubLink = addProtocolToUrl(githubLink);
  const hoverImageRef = useRef<HTMLDivElement>(null);

  return (
    <article
      onMouseEnter={() =>
        hoverImageRef.current &&
        triggerMouseEvent(hoverImageRef.current, 'mouseenter')
      }
      onMouseLeave={() =>
        hoverImageRef.current &&
        triggerMouseEvent(hoverImageRef.current, 'mouseleave')
      }
      className={cn(
        `
				p-[2px] overflow-hidden z-10 
        rounded-[0.80rem] animate-gradient__rotate animate-gradient__activeXs
        relative group`,
        className
      )}
      {...props}
    >
      <div
        className={cn(`
          block p-4 
          bg-white bg-opacity-10 backdrop-blur-sm 
          rounded-xl border border-white border-opacity-10 
          z-10
					`)}
      >
        <a href={`/project/${slug}`} className="absolute inset-0" />
        <HoverEffectImage
          ref={hoverImageRef}
          image1={thumbnailGreeting}
          image2={thumbnailPreview}
          displacementImage={dispImg.src}
          className={cn(`
            bg-[#0D1420] 
            h-[300px] w-full 
            rounded-xl 
            overflow-clip pointer-events-none
            `)}
        />

        <div className="px-3 py-4">
          <div className="">
            <p
              className={`
							text-base text-gray-300 group-hover:text-opacity-100 
							text-opacity-80 font-medium
							transition-all duration-200 
							`}
            >
              {role}
            </p>
            <h3
              className={`
							white_gradient 
							font-bold bg-clip-text text-transparent text-3xl
							`}
            >
              {name}
            </h3>
          </div>

          <hr className="border-white opacity-10 my-6" />

          <div className="flex items-center justify-between gap-3 relative z-20 flex-col lg:flex-row">
            <div className="flex items-center gap-3 flex-wrap">
              {technologies.map((t) => (
                <a
                  key={t.id}
                  href={t.link}
                  target="_blank"
                  className={cn(`
									text-xl opacity-60 
									hover:opacity-90 transition-all duration-200
								`)}
                >
                  <Icon icon={t.iconifyId} />
                </a>
              ))}
            </div>
            <div>
              <a
                href={formattedGithubLink}
                className={cn(`text-xl opacity-60 
									hover:opacity-90 transition-all duration-200`)}
                target="_blank"
              >
                <Icon icon="octicon:logo-github-24" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <i></i>
    </article>
  );
};

export default ProjectCard;
