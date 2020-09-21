
import { Provider } from "./scrapers/types";

/** This is a single chapter */
export interface Chapter {
	/** Season of chapter */
	season: number;
	/** Chapter number */
	chapter: number;
	/** Label, for example "Chapter 123" or "Z= 123" */
	label: string;
	/** Manga's date */
	date: Date;
	/**
	 * How far along the user is.
	 * This is everchanging, but also optional
	 */
	progress?: Progress;
	realProgress?: Progress;
	/** Season and chapter combined for sorting purposes, for example 300012 */
	combined?: number;
	/** 
	 * Href string, really just the chaptor indicator
	 * For mangasee, this is "x-y".
	 * MangaDex has a unique ID for each chapter, so that's just a number sequence
	 */
	hrefString: string;
}

/** Used in manga.constant, these are mostly unchanging */
export interface MangaMeta {
	slug: string;
	posterUrl: string;
	title: string;
	alternateTitles: string[];
	descriptionParagraphs: string[];
	genres: string[];
}
/** Stored under manga.data, used for more dynamic stuff */
export interface MangaData {
	chapters: Chapter[];
	chapterImages?: string[];
}

/** Entire database structure */
export interface Database {
	manga_cache: {
		[key: string]: MangaMeta;
	}
	reading_new: Reading;
	other: {
		host?: string
	},
	notified: {
		[key: string]: {
			[key: string]: true // 
		}
	}
	lists: List[];
	settings: {
		icon: string;
	}
}
/** Save what the user is currently reading */
export interface Reading {
	[key: string]: {
		[key: string]: Progress
	}
}

// Scraper interfaces
export type ScraperResponse = StoredData | ScraperError;
/** Data returned by scrapers */
export interface ScraperData {
	constant: MangaMeta;
	data: MangaData;
	provider: Provider; // All possible scrapers. Useful for future proofing
	success: true; // Always true
}
/** Error object thrown by scrapers */
export interface ScraperError {
	status: number;
	err: string;
	success: false; // Always false
}

/** Extended ScrapeData with front-end variables */
export interface StoredData extends ScraperData {
	savedAt?: number;
	progress?: Progress;
	realProgress?: Progress;
}

/** Object for progress. Can be stored under ["manga-slug"]["1-5"] */
export interface Progress {
	/** Current page */
	current: number;
	/** Total pages in chapter */
	total: number
	/** Date timestamp */
	at: number;
	/** 
	 * Slug format per scraper
	 * For mangasee that's season-chapter,
	 * MangaDex has its own ID for each chapter
	 */
	chapterId: string | number;
	/** Progress in percentages */
	percentage?: number; // Between 0-100
	percentageColor?: string; // Used in list of chapters
	/** Is new? */
	new?: boolean;
}

/** "List" type. Used for users to store manga */
export interface List {
	showOnHome: boolean;
	byCreator?: boolean;
	name: string;
	slug: string;
	last?: number;
	entries: {
		slug: string;
		provider?: string;
		data?: ScraperResponse
	}[];
}