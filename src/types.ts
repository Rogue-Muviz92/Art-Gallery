export interface Painting {
  url: string;
  title: string;
  year: string;
  medium: string;
  dimensions: string;
  description: string;
}

export interface ArtistProfile {
  fatherName: string;
  logoText: string;
  tagline: string;
  philosophyQuote: string;
  philosophyAuthor: string;
  journeyTitle: string;
  journeyParagraphs: string[];
  contactTitle?: string;
  contactText: string;
  contactEmail: string;
  contactPhone?: string;
  portraitUrl: string;
  portraitCaption: string;
  brushstrokeUrl: string;
  brushstrokeCaption: string;
  painting1: Painting; // Huge Hero
  painting2: Painting; // Small 1
  painting3: Painting; // Small 2
  painting4: Painting; // Medium 1
  painting5: Painting; // Medium 2
  painting6: Painting; // Medium 3
  painting7: Painting; // Medium 4
}
