const visDiv = document.getElementById("vis");
const arrText = document.getElementById("arrTxt");
const randomizeBtn = document.getElementById("randomize");

// Buttons
const selBtn = document.getElementById("sel");
const bubbleBtn = document.getElementById("bubble");
const insertionBtn = document.getElementById("insertion");
const mergeBtn = document.getElementById("merge");
const quickBtn = document.getElementById("quick");
const radixBtn = document.getElementById("radix");

// Initial Array
let arr = [50, 20, 80, 40, 10, 90, 30, 70, 60];

function renderArray(array) {
  visDiv.innerHTML = "";
  array.forEach((value, index) => {
    const container = document.createElement("div");
    container.className = "flex flex-col items-center justify-end";

    const number = document.createElement("span");
    number.innerText = value;
    number.className = "mb-2 text-sm font-bold text-gray-700";

    const bar = document.createElement("div");
    bar.className = "w-6 bg-red-600 transition-all duration-300";
    bar.style.height = value * 3 + "px"; // scale bar height

    const idx = document.createElement("span");
    idx.innerText = index;
    idx.className = "mt-2 mb-3 text-xs text-gray-600";

    container.appendChild(number);
    container.appendChild(bar);
    container.appendChild(idx);
    visDiv.appendChild(container);
  });
  arrText.innerText = "[" + array.toString() + "]";
}

renderArray(arr);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function swap(array, i, j) {
  let tmp = array[i];
  array[i] = array[j];
  array[j] = tmp;
}

// Update UI
function updateBars(array, highlight1 = -1, highlight2 = -1) {
  const bars = visDiv.children;
  for (let i = 0; i < bars.length; i++) {
    let bar = bars[i].children[1];
    let number = bars[i].children[0];
    bar.style.height = array[i] * 3 + "px";
    number.innerText = array[i];

    if (i === highlight1 || i === highlight2) {
      bar.className =
        "w-6 bg-yellow-500 transition-all duration-300";
    } else {
      bar.className =
        "w-6 bg-red-600 transition-all duration-300";
    }
  }
  arrText.innerText = "[" + array.toString() + "]";
}

function generateRandomArray(size = 10, maxVal = 100) {
  const newArr = [];
  for (let i = 0; i < size; i++) {
    newArr.push(Math.floor(Math.random() * maxVal) + 1);
  }
  return newArr;
}

randomizeBtn.onclick = () => {
  arr = generateRandomArray(10, 100); // change size or maxVal if you want
  renderArray(arr);
};


//
// Sorting Algorithms
//

// Selection Sort
async function selectionSort(array) {
  for (let i = 0; i < array.length; i++) {
    let minIndex = i;
    for (let j = i + 1; j < array.length; j++) {
      updateBars(array, minIndex, j);
      await sleep(300);
      if (array[j] < array[minIndex]) {
        minIndex = j;
      }
    }
    swap(array, i, minIndex);
    updateBars(array, i, minIndex);
    await sleep(300);
  }
}

// Bubble Sort
async function bubbleSort(array) {
  for (let i = 0; i < array.length - 1; i++) {
    for (let j = 0; j < array.length - i - 1; j++) {
      updateBars(array, j, j + 1);
      await sleep(200);
      if (array[j] > array[j + 1]) {
        swap(array, j, j + 1);
      }
      updateBars(array, j, j + 1);
      await sleep(200);
    }
  }
}

// Insertion Sort
async function insertionSort(array) {
  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;
    while (j >= 0 && array[j] > key) {
      array[j + 1] = array[j];
      updateBars(array, j, j + 1);
      await sleep(200);
      j--;
    }
    array[j + 1] = key;
    updateBars(array, j + 1, i);
    await sleep(200);
  }
}

// Merge Sort (with visualization)
async function mergeSort(array, l = 0, r = array.length - 1) {
  if (l >= r) return;
  const mid = Math.floor((l + r) / 2);
  await mergeSort(array, l, mid);
  await mergeSort(array, mid + 1, r);
  await merge(array, l, mid, r);
}

async function merge(array, l, mid, r) {
  const left = array.slice(l, mid + 1);
  const right = array.slice(mid + 1, r + 1);

  let i = 0, j = 0, k = l;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      array[k] = left[i++];
    } else {
      array[k] = right[j++];
    }
    updateBars(array, k);     // ✅ use local array
    await sleep(200);
    k++;
  }

  while (i < left.length) {
    array[k] = left[i++];
    updateBars(array, k);
    await sleep(200);
    k++;
  }

  while (j < right.length) {
    array[k] = right[j++];
    updateBars(array, k);
    await sleep(200);
    k++;
  }
}

// Quick Sort
async function quickSort(array, low = 0, high = array.length - 1) {
  if (low < high) {
    let pi = await partition(array, low, high);
    await quickSort(array, low, pi - 1);
    await quickSort(array, pi + 1, high);
  }
}

async function partition(array, low, high) {
  let pivot = array[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    updateBars(array, j, high);
    await sleep(250);
    if (array[j] < pivot) {
      i++;
      swap(array, i, j);
      updateBars(array, i, j);
      await sleep(250);
    }
  }
  swap(array, i + 1, high);
  updateBars(array, i + 1, high);
  await sleep(250);
  return i + 1;
}

// Radix Sort
async function radixSort(array) {
  let maxNum = Math.max(...array);
  let exp = 1;
  while (Math.floor(maxNum / exp) > 0) {
    await countingSort(array, exp);
    exp *= 10;
  }
}

async function countingSort(array, exp) {
  let output = new Array(array.length).fill(0);
  let count = new Array(10).fill(0);

  for (let i = 0; i < array.length; i++) {
    count[Math.floor(array[i] / exp) % 10]++;
  }

  for (let i = 1; i < 10; i++) {
    count[i] += count[i - 1];
  }

  for (let i = array.length - 1; i >= 0; i--) {
    output[count[Math.floor(array[i] / exp) % 10] - 1] = array[i];
    count[Math.floor(array[i] / exp) % 10]--;
  }

  for (let i = 0; i < array.length; i++) {
    array[i] = output[i];
    updateBars(array, i);
    await sleep(150);
  }
}

//
// Button Events
//
selBtn.onclick = async () => {
  let copy = [...arr];
  await selectionSort(copy);
};

bubbleBtn.onclick = async () => {
  let copy = [...arr];
  await bubbleSort(copy);
};

insertionBtn.onclick = async () => {
  let copy = [...arr];
  await insertionSort(copy);
};

mergeBtn.onclick = async () => {
  let copy = [...arr];
  await mergeSort(copy);
};

quickBtn.onclick = async () => {
  let copy = [...arr];
  await quickSort(copy);
};

radixBtn.onclick = async () => {
  let copy = [...arr];
  await radixSort(copy);
};
