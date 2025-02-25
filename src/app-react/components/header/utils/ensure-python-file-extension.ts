const PYTHON_FILE_EXTENSION = ".py";

export const ensurePythonFileExtension = (filepath: string): string => {
  const filepathLowerCase = filepath.toLowerCase();
  const pythonFileExtensionLowerCase = PYTHON_FILE_EXTENSION.toLowerCase();

  return `${filepath}${
    filepathLowerCase.lastIndexOf(pythonFileExtensionLowerCase) !== -1 &&
    filepathLowerCase.lastIndexOf(pythonFileExtensionLowerCase) === filepath.length - PYTHON_FILE_EXTENSION.length
      ? ""
      : PYTHON_FILE_EXTENSION
  }`;
};
