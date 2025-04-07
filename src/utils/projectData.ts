import { IconType } from 'react-icons';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

export type VisualizationType = 'image' | 'html';

export interface Visualization {
  type: VisualizationType;
  caption: string;
  url?: string;         // For image type
  htmlContent?: string; // For HTML type
  height?: string;      // Optional height for HTML content
  width?: string;       // Optional width for HTML content
}

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
  date?: {
    season: string;
    year: number;
  };
}

export interface ResearchProject extends BaseProject {
  tags: string[];
  technicalTags: string[];
  images: ProjectImage[];
  visualizations?: Visualization[];  // New field for enhanced visualizations
  keyTakeaways: string[];
  collaborators: string[];
}

export interface CodingProject extends BaseProject {
  tags: string[];
  technologies: string[];
  features: string[];
  screenshots: ProjectImage[];
  collaborators?: string[];
  workflow?: {
    step: string;
    description: string;
  }[];
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