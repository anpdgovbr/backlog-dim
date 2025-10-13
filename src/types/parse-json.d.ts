declare module "parse-json" {
  type Reviver = (key: string, value: unknown) => unknown
  interface ParseJsonOptions {
    allowDuplicate?: boolean
    comment?: boolean
    // add other options as needed
  }
  function parse(input: string, options?: ParseJsonOptions, reviver?: Reviver): unknown
  export default parse
}
