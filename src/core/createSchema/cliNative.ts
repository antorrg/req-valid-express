import * as readline from "readline";

const Colors = {
  reset: "\x1b[0m",
  cyan: "\x1b[36m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  dim: "\x1b[2m",
};

const Cursor = {
  hide: "\x1b[?25l",
  show: "\x1b[?25h",
  up: (n = 1) => `\x1b[${n}A`,
  clearLine: "\x1b[2K\x1b[0G",
};

export async function promptInput(
  message: string,
  options?: { validate?: (input: string) => boolean | string; default?: string }
): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const defaultText = options?.default ? ` ${Colors.dim}(${options.default})${Colors.reset}` : "";
  const query = `${Colors.green}?${Colors.reset} ${message}${defaultText} `;

  return new Promise((resolve) => {
    const ask = () => {
      rl.question(query, (answer) => {
        const value = answer.trim() === "" && options?.default ? options.default : answer;
        
        if (options?.validate) {
          const valid = options.validate(value);
          if (valid !== true) {
            console.log(`${Colors.red}>> ${typeof valid === "string" ? valid : "Invalid input"}${Colors.reset}`);
            ask();
            return;
          }
        }
        
        rl.close();
        resolve(value);
      });
    };
    ask();
  });
}

export async function promptConfirm(
  message: string,
  options?: { default?: boolean }
): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const defaultText = options?.default !== undefined
    ? options.default ? " (Y/n)" : " (y/N)"
    : " (y/n)";

  const query = `${Colors.green}?${Colors.reset} ${message}${defaultText} `;

  return new Promise((resolve) => {
    rl.question(query, (answer) => {
      rl.close();
      const val = answer.trim().toLowerCase();
      if (val === "y" || val === "yes") resolve(true);
      else if (val === "n" || val === "no") resolve(false);
      else resolve(options?.default ?? false);
    });
  });
}

export async function promptList<T>(
  message: string,
  choices: { name?: string; value: T }[] | T[]
): Promise<T> {
  const parsedChoices = choices.map((c) =>
    typeof c === "object" && c !== null && "value" in c
      ? (c as { name?: string; value: T })
      : { name: String(c), value: c as T }
  );

  return new Promise((resolve) => {
    let selectedIndex = 0;
    const cleanup = setupRawMode();

    const render = () => {
      let output = `${Colors.green}?${Colors.reset} ${message}\n`;
      parsedChoices.forEach((choice, index) => {
        if (index === selectedIndex) {
          output += `${Colors.cyan}❯ ${choice.name || String(choice.value)}${Colors.reset}\n`;
        } else {
          output += `  ${choice.name || String(choice.value)}\n`;
        }
      });
      process.stdout.write(output);
    };

    const clear = () => {
      const lines = parsedChoices.length + 1;
      process.stdout.write(Cursor.up(lines));
      for (let i = 0; i < lines; i++) {
        process.stdout.write(Cursor.clearLine + "\n");
      }
      process.stdout.write(Cursor.up(lines));
    };

    const onKeyPress = (str: string, key: any) => {
      if (key.name === "up") {
        clear();
        selectedIndex = (selectedIndex - 1 + parsedChoices.length) % parsedChoices.length;
        render();
      } else if (key.name === "down") {
        clear();
        selectedIndex = (selectedIndex + 1) % parsedChoices.length;
        render();
      } else if (key.name === "return") {
        clear();
        cleanup(onKeyPress);
        const selected = parsedChoices[selectedIndex];
        console.log(`${Colors.green}?${Colors.reset} ${message} ${Colors.cyan}${selected.name || String(selected.value)}${Colors.reset}`);
        resolve(selected.value);
      } else if (key.ctrl && key.name === "c") {
        cleanup(onKeyPress);
        process.exit(0);
      }
    };

    process.stdout.write(Cursor.hide);
    render();
    process.stdin.on("keypress", onKeyPress);
  });
}

export async function promptCheckbox<T>(
  message: string,
  choices: { name?: string; value: T }[] | T[]
): Promise<T[]> {
  const parsedChoices = choices.map((c) =>
    typeof c === "object" && c !== null && "value" in c
      ? (c as { name?: string; value: T })
      : { name: String(c), value: c as T }
  );
  
  const checked = new Array(parsedChoices.length).fill(false);

  return new Promise((resolve) => {
    let selectedIndex = 0;
    const cleanup = setupRawMode();

    const render = () => {
      let output = `${Colors.green}?${Colors.reset} ${message} ${Colors.dim}(Press <space> to select, <return> to submit)${Colors.reset}\n`;
      parsedChoices.forEach((choice, index) => {
        const isSelected = index === selectedIndex;
        const isChecked = checked[index];
        const prefix = isSelected ? `${Colors.cyan}❯${Colors.reset}` : " ";
        const check = isChecked ? `${Colors.green}◉${Colors.reset}` : "◯";
        const color = isSelected ? Colors.cyan : "";
        
        output += `${prefix} ${check} ${color}${choice.name || String(choice.value)}${Colors.reset}\n`;
      });
      process.stdout.write(output);
    };

    const clear = () => {
      const lines = parsedChoices.length + 1;
      process.stdout.write(Cursor.up(lines));
      for (let i = 0; i < lines; i++) {
        process.stdout.write(Cursor.clearLine + "\n");
      }
      process.stdout.write(Cursor.up(lines));
    };

    const onKeyPress = (str: string, key: any) => {
      if (key.name === "up") {
        clear();
        selectedIndex = (selectedIndex - 1 + parsedChoices.length) % parsedChoices.length;
        render();
      } else if (key.name === "down") {
        clear();
        selectedIndex = (selectedIndex + 1) % parsedChoices.length;
        render();
      } else if (key.name === "space") {
        clear();
        checked[selectedIndex] = !checked[selectedIndex];
        render();
      } else if (key.name === "return") {
        clear();
        cleanup(onKeyPress);
        const selectedItems = parsedChoices.filter((_, i) => checked[i]);
        const names = selectedItems.length > 0 
          ? selectedItems.map((c) => c.name || String(c.value)).join(", ")
          : "None";
        console.log(`${Colors.green}?${Colors.reset} ${message} ${Colors.cyan}${names}${Colors.reset}`);
        resolve(selectedItems.map((c) => c.value));
      } else if (key.ctrl && key.name === "c") {
        cleanup(onKeyPress);
        process.exit(0);
      }
    };

    process.stdout.write(Cursor.hide);
    render();
    process.stdin.on("keypress", onKeyPress);
  });
}

function setupRawMode() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  readline.emitKeypressEvents(process.stdin);
  if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
  }
  
  return (listener: any) => {
    process.stdin.removeListener("keypress", listener);
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(false);
    }
    rl.close();
    process.stdout.write(Cursor.show);
  };
}
