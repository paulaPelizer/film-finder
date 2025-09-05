export interface OMDbMovieSummary {
  imdbID: string;
  Title: string;
  Year: string;
  Type: string;
  Poster: string;
}
export interface OMDbSearchResult {
  Search?: OMDbMovieSummary[];
  totalResults?: string;
  Response: 'True' | 'False';
  Error?: string;
}
export interface OMDbMovieFull extends OMDbMovieSummary {
  Rated?: string; Released?: string; Runtime?: string; Genre?: string;
  Director?: string; Writer?: string; Actors?: string; Plot?: string;
  Language?: string; Country?: string; Awards?: string;
  Ratings?: { Source: string; Value: string }[];
  Metascore?: string; imdbRating?: string; imdbVotes?: string;
  DVD?: string; BoxOffice?: string; Production?: string; Website?: string;
}