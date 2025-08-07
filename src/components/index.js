// This barrel file is used to make importing in App.js cleaner

// Re-export all named exports from the layout/ barrel file
export * from './layout';

// Export everything from the components/ directory
export { default as AboutUs } from './AboutUs';
export { default as Activity } from './Activity';
export { default as EditProfile } from './EditProfile'
export { default as Feed } from './Feed';
export { default as Home } from './Home';
export { default as Login } from './Login';
export { default as Profile } from './Profile';
export { default as PublishedQuotes } from './PublishedQuotes';
export { default as QuotesFound } from './QuotesFound';
export { default as SavedQuotes } from './SavedQuotes';
export { default as SignUp } from './SignUp';
export { default as Theme1 } from './Theme1';
export { default as Theme2 } from './Theme2';
export { default as Theme3 } from './Theme3';
export { default as Theme4 } from './Theme4';