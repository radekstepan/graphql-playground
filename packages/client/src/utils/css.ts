const css = (...classes: unknown[]) => classes.filter(Boolean).join(' ');

export default css;
