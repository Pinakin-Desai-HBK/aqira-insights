import { PROJECT_FILE_EXTENSION } from "../../../consts/consts";

export const ensureProjectFileExtension = (filepath: string): string => {
  const filepathLowerCase = filepath.toLowerCase();
  const projectFileExtensionLowerCase = PROJECT_FILE_EXTENSION.toLowerCase();

  return `${filepath}${
    filepathLowerCase.lastIndexOf(projectFileExtensionLowerCase) !== -1 &&
    filepathLowerCase.lastIndexOf(projectFileExtensionLowerCase) === filepath.length - PROJECT_FILE_EXTENSION.length
      ? ""
      : PROJECT_FILE_EXTENSION
  }`;
};
