/// <reference types="react-scripts" />

declare module '*.svg' {
  const content: any;
  export default content;
}

declare module '*.svg?react' {
  const content: any;
  export default content;
}

declare module '*.css' {
  const content: any;
  export default content;
}

declare module '*.gif' {
  const content: any;
  export default content;
}

declare module '*.png' {
  const content: any;
  export default content;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
