import { IconType } from 'react-icons';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

export interface ProjectImage {
  url: string;
  caption: string;
}

export interface ProjectLink {
  title: string;
  url: string;
  icon?: string;
}

export interface BaseProject {
  title: string;
  description: string;
  fullDescription: string;
  links: ProjectLink[];
}

export interface ResearchProject extends BaseProject {
  tags: string[];
  technicalTags: string[];
  images: ProjectImage[];
  keyTakeaways: string[];
  collaborators: string[];
}

export interface CodingProject extends BaseProject {
  technologies: string[];
  features: string[];
  screenshots: ProjectImage[];
}

export interface ProjectsData {
  research: {
    [key: string]: ResearchProject;
  };
  coding: {
    [key: string]: CodingProject;
  };
}

export const getIconComponent = (iconName: string): IconType => {
  switch (iconName) {
    case 'GitHub':
      return FaGithub;
    case 'Launch':
      return FaExternalLinkAlt;
    default:
      return FaExternalLinkAlt;
  }
};

export const fetchProjects = async (): Promise<ProjectsData> => {
  try {
    const response = await fetch('/data/projects.json');
    if (!response.ok) {
      throw new Error('Failed to fetch projects data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching projects:', error);
    return {
      research: {},
      coding: {}
    };
  }
}; 