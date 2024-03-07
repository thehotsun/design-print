export function ContextMenu(options) {
  // 唯一实例
  let instance;
  // 创建实例方法
  function createMenu() {
    const ul = document.createElement("ul");
    ul.classList.add("custom-context-menu");
    const { menus } = options;
    if (menus && menus.length > 0) {
      for (let menu of menus) {
        const li = document.createElement("li");
        // li.classList.add("custom-context-menu-menuitem");
        li.textContent = menu.name;
        li.onclick = menu.onClick;
        ul.appendChild(li);
      }
    }
    const body = document.querySelector("body");
    body.appendChild(ul);
    return ul;
  }

  return {
    // 获取实例的唯一方式
    getInstance: function () {
      if (!instance) {
        instance = createMenu();
      }
      return instance;
    }
  };
}

export const generateId = (randomLength = 10) => {
  return Number(Math.random().toString().substring(2, randomLength) + Date.now()).toString(36);
};

export function findNearestTd(el) {
  while (el && el.tagName !== "TD") {
    el = el.parentNode;
  }
  return el;
}

export function mergeStyle(style = "", styleForm) {
  console.log(styleForm);
  if (typeof style !== "string") {
    style = "";
  }
  const camel = ["fontFamily", "fontSize", "backgroundColor", "color"];
  let str = "";
  camel.map((key) => {
    str += `;${convertCamelToSnake(key)}:${key === "fontSize" ? styleForm[key] + "px" : styleForm[key]}`;
  });
  const { isBold, isItalic, isStrikethrough, isUnderline, verticalAlign, textAlign } = styleForm;
  if (isBold) {
    str += `;font-weight: 700`;
  }
  if (isItalic) {
    str += `;font-style: italic`;
  }
  if (isStrikethrough && isUnderline) {
    str += `; text-decoration: underline line-through`;
  } else if (isStrikethrough) {
    str += `; text-decoration: line-through`;
  } else if (isUnderline) {
    str += `; text-decoration: underline`;
  }
  str += `; justify-content: ${textAlign}`;
  str += `; align-items: ${verticalAlign}`;
  return style + str;
}

function convertCamelToSnake(camelCase) {
  return camelCase.replace(/([A-Z])/g, (match) => `-${match.toLowerCase()}`);
}
