const isObject = ( value ) =>
  value !== null && typeof value === "object" && !Array.isArray( value );

const parseResponse = async ( response ) => {
  const contentType = response.headers.get( "content-type" ) || "";
  const result = contentType.includes( "application/json" )
    ? await response.json()
    : await response.text();
  if ( !response.ok ) {
    const message =
      isObject( result ) && result.message ? result.message : response.statusText;
    throw new Error(
      message || `API request failed with status ${ response.status }.`,
    );
  }
  return result;
};

export class ApiClient {
  constructor( url, rules = {}, options = {} ) {
    if ( typeof url !== "string" || !url )
      throw new TypeError( "Superiod.Api requires a backend URL." );
    if ( !isObject( rules ) ) throw new TypeError( "API rules must be an object." );
    this.url = url;
    this.rules = rules;
    this.options = options;
  }

  request( ruleName, data = {}, requestOptions = {} ) {
    const rule = this.rules[ ruleName ];
    if ( !rule ) throw new Error( `API rule "${ ruleName }" is not defined.` );

    const definition = typeof rule === "string" ? { action: rule } : rule;
    const method = ( definition.method || "POST" ).toUpperCase();
    const action = definition.action || ruleName;
    const headers = {
      ...( method === "GET" ? {} : { "Content-Type": "application/json" } ),
      ...( this.options.headers || {} ),
      ...( definition.headers || {} ),
      ...( requestOptions.headers || {} ),
    };
    const fetchOptions = {
      ...this.options,
      ...definition,
      ...requestOptions,
      method,
      headers,
    };
    delete fetchOptions.action;
    delete fetchOptions.headers;
    delete fetchOptions.body;

    let requestUrl = this.url;
    const payload = isObject( data ) ? { ...data } : data;
    if ( method === "GET" || method === "HEAD" ) {
      const query = new URLSearchParams( {
        rule: action,
        ...( isObject( payload ) ? payload : {} ),
      } );
      requestUrl += `${ requestUrl.includes( "?" ) ? "&" : "?" }${ query }`;
    } else {
      fetchOptions.body = JSON.stringify( {
        rule: action,
        ...( isObject( payload ) ? payload : { data: payload } ),
      } );
    }

    return fetch( requestUrl, fetchOptions ).then( parseResponse );
  }
}

export function createApi( urlOrOptions, rules, options = {} ) {
  const config = isObject( urlOrOptions )
    ? urlOrOptions
    : { url: urlOrOptions, rules, ...options };
  const { url, rules: configuredRules, ...requestOptions } = config;
  const client = new ApiClient( url, configuredRules || {}, requestOptions );
  return new Proxy( client, {
    get( target, property, receiver ) {
      if ( property in target ) return Reflect.get( target, property, receiver );
      if ( typeof property !== "string" || !( property in target.rules ) )
        return undefined;
      return ( data, requestOptions ) =>
        target.request( property, data, requestOptions );
    },
  } );
}
