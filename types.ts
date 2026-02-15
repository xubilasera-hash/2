
export interface Identity {
  id?: string;
  full_name: string;
  title: string;
  bio: string;
  logo_url: string;
  email: string;
  github_url: string;
  linkedin_url: string;
}

export interface Notice {
  id: string;
  title: string;
  description: string;
  pdf_url: string;
  created_at: string;
}

export interface GalleryImage {
  id: string;
  caption: string;
  image_url: string;
  created_at: string;
}
