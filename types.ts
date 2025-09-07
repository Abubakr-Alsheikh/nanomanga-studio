/**
 * Represents a user-generated asset, which can be a character or an environment.
 */
export interface IAsset {
  id: string;
  name: string;
  type: 'character' | 'environment';
  prompt: string;
  imageUrl: string; // URL to the generated image
}

/**
 * Represents a single generated manga page.
 */
export interface IMangaPage {
  id:string;
  pageNumber: number;
  prompt: string;
  imageUrl: string; // URL to the generated manga page image
}

/**
 * Represents the entire state of the user's manga project.
 */
export interface IProjectState {
  storySummary: string;
  artStyleInstructions: string;
  characters: IAsset[];
  environments: IAsset[];
  pages: IMangaPage[];
}