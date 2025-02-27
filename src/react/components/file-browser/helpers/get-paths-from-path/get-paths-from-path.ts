import { FILE_SEPARATOR } from "../../consts/consts";

export const getPathsFromPath = (path: string): string[] => {
  const pathsToGet: string[] = [""];

  if (path !== "") {
    const pathParts = path.split(FILE_SEPARATOR);
    if (pathParts.length === 2 && pathParts[1] === "") {
      pathsToGet.push(pathParts[0] + FILE_SEPARATOR);
    } else {
      let id = pathParts[0] + FILE_SEPARATOR;
      pathsToGet.push(id);
      if (pathParts.length > 1) {
        for (let i = 1; i < pathParts.length; i++) {
          id += pathParts[i];
          pathsToGet.push(id);
          id += i < pathParts.length - 1 ? FILE_SEPARATOR : "";
        }
      }
    }
  }

  return pathsToGet;
};
