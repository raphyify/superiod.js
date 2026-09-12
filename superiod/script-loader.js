const importedScripts = new Map();

export function afterScriptLoad( modules, callback ) {
  if ( typeof callback !== "function" )
    return Promise.reject( new TypeError( "A callback function is required." ) );
  if ( typeof document === "undefined" )
    return Promise.reject( new Error( "Scripts require a browser document." ) );

  const names = Array.isArray( modules ) ? modules : [ modules ];
  const scripts = names.map( ( name ) => {
    if ( typeof name !== "string" || !name )
      throw new TypeError( "Script module names must be non-empty strings." );
    const script = [ ...document.scripts ].find(
      ( candidate ) =>
        candidate.dataset.superiodModule === name ||
        candidate.dataset.module === name ||
        candidate.id === name ||
        candidate.src === name ||
        candidate.src.endsWith( `/${ name }` ) ||
        candidate.src.endsWith( `/${ name }.js` ),
    );
    if ( !script ) throw new Error( `Script module "${ name }" was not found.` );
    return script;
  } );

  const waitForScript = ( script ) =>
    new Promise( ( resolve, reject ) => {
      if ( script.readyState === "complete" || script.readyState === "loaded" ) {
        resolve();
        return;
      }
      const loaded = () => {
        cleanup();
        resolve();
      };
      const failed = () => {
        cleanup();
        reject(
          new Error( `Script "${ script.src || script.id }" failed to load.` ),
        );
      };
      const cleanup = () => {
        script.removeEventListener( "load", loaded );
        script.removeEventListener( "error", failed );
      };
      script.addEventListener( "load", loaded, { once: true } );
      script.addEventListener( "error", failed, { once: true } );
    } );

  return Promise.all( scripts.map( waitForScript ) ).then( () => callback() );
}

export function importScript( script ) {
  if ( typeof script !== "string" || !script )
    return Promise.reject( new TypeError( "A non-empty script URL is required." ) );
  if ( typeof document === "undefined" )
    return Promise.reject( new Error( "Scripts require a browser document." ) );

  const url = new URL( script, document.baseURI ).href;
  const existing = importedScripts.get( url );
  if ( existing ) return existing;

  const promise = new Promise( ( resolve, reject ) => {
    const element = document.createElement( "script" );
    element.type = "module";
    element.src = url;
    element.addEventListener( "load", () => resolve(), { once: true } );
    element.addEventListener(
      "error",
      () => reject( new Error( `Script "${ script }" failed to load.` ) ),
      { once: true },
    );
    document.head.appendChild( element );
  } ).catch( ( error ) => {
    importedScripts.delete( url );
    throw error;
  } );

  importedScripts.set( url, promise );
  return promise;
}
