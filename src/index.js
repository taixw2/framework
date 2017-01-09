import Data from "./Data.js";
import BaseModule from "./BaseModule.js";

const moduleCache = {};

const cachePre = new Data();

cachePre.access(moduleCache);

cachePre.access(moduleCache,"BaseModule",BaseModule);
