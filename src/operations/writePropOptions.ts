import * as ts from "ts-morph";

export function writePropOptions(
  writer: ts.CodeBlockWriter,
  options: {
    required?: ts.PropertyAssignment;
    default?: ts.PropertyAssignment;
  }
) {
  // Only permit exactly one of `default` and `required`,
  // since a default value implies required is false in Vue.
  // There actually doesn't seem to be a use-case to set both!
  if (options.default) {
    writer.write(options.default.getText());
  } else if (options.required) {
    writer.write(options.required.getText());
  } else {
    // Lastly, if neither property is directly supplied, mark `required` false.
    writer.write("required: false");
  }

  writer.write(",").newLine();
}
