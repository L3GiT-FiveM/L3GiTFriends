const app = document.getElementById('app');
const panel = document.getElementById('panel');
const panelHeader = document.getElementById('panelHeader');
const list = document.getElementById('list');
const emptyState = document.getElementById('emptyState');
const detail = document.getElementById('detail');
const detailName = document.getElementById('detailName');
const detailDistance = document.getElementById('detailDistance');
const detailClose = document.getElementById('detailClose');
const noteInput = document.getElementById('noteInput');
const addNoteBtn = document.getElementById('addNoteBtn');
const notesList = document.getElementById('notesList');
const removeBtn = document.getElementById('removeBtn');
const confirmModal = document.getElementById('confirmModal');
const confirmMessage = document.getElementById('confirmMessage');
const confirmYes = document.getElementById('confirmYes');
const confirmCancel = document.getElementById('confirmCancel');
const confirmClose = document.getElementById('confirmClose');
const giftList = document.getElementById('giftList');
const inventoryEl = document.getElementById('inventory');
const sendGiftBtn = document.getElementById('sendGiftBtn');
const giftError = document.getElementById('giftError');
const openGiftModalBtn = document.getElementById('openGiftModal');
const giftModal = document.getElementById('giftModal');
const giftClose = document.getElementById('giftClose');
const selectedList = document.getElementById('selectedList');
const closeBtn = document.getElementById('closeBtn');
const toast = document.getElementById('toast');
const blipColorGrid = document.getElementById('blipColorGrid');

let visible = false;
let friendsState = [];
let giftsState = [];
let inventoryState = [];
let selectedFriend = null;
let selectedItems = [];
let dragState = null;
let toastTimer = null;
let currentColorId = 2;

const BLIP_COLORS = [
  { id: 2, label: 'Green' },
  { id: 3, label: 'Blue' },
  { id: 5, label: 'Yellow' },
  { id: 8, label: 'Purple' },
  { id: 11, label: 'Cyan' },
  { id: 17, label: 'Pink' },
  { id: 18, label: 'Light Green' },
  { id: 27, label: 'White' }
];

const BLIP_COLOR_RGB = {
  1: [255, 0, 0],
  2: [0, 255, 0],
  3: [0, 0, 255],
  5: [255, 255, 0],
  6: [255, 165, 0],
  8: [128, 0, 128],
  11: [0, 255, 255],
  17: [255, 105, 180],
  18: [144, 238, 144],
  24: [139, 0, 0],
  27: [255, 255, 255]
};

function renderColorOptions() {
  if (!blipColorGrid) return;
  blipColorGrid.innerHTML = '';
  for (const color of BLIP_COLORS) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'color-swatch-btn';
    btn.title = color.label;
    btn.dataset.value = String(color.id);
    const rgb = BLIP_COLOR_RGB[color.id];
    if (rgb) btn.style.backgroundColor = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    if (Number(color.id) === Number(currentColorId)) btn.classList.add('selected');
    btn.addEventListener('click', () => setColor(Number(color.id), true));
    blipColorGrid.appendChild(btn);
  }
}

function setColor(colorId, notify) {
  currentColorId = colorId;
  renderColorOptions();
  if (notify && selectedFriend) {
    postNui('setBlipColor', { name: selectedFriend.name, color: colorId });
    renderFriends(friendsState);
  }
}

function initColorPicker() {
  renderColorOptions();
}

function postNui(name, data = {}) {
  return fetch(`https://${GetParentResourceName()}/${name}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify(data)
  }).then(res => res.json()).catch(() => null);
}

function setVisible(state) {
  visible = state;
  if (visible) {
    app.classList.remove('hidden');
    applySavedPosition();
    positionToast();
  } else {
    app.classList.add('hidden');
    detail.classList.add('hidden');
    giftModal.classList.add('hidden');
    confirmModal.classList.add('hidden');
    selectedFriend = null;
    selectedItems = [];
    hideToast();
  }
}

function applySavedPosition() {
  try {
    const saved = JSON.parse(localStorage.getItem('l3git_friends_pos') || 'null');
    if (saved && typeof saved.x === 'number' && typeof saved.y === 'number') {
      panel.style.left = `${saved.x}px`;
      panel.style.top = `${saved.y}px`;
      panel.style.right = 'auto';
    }
  } catch (_) {}
}

function savePosition(x, y) {
  localStorage.setItem('l3git_friends_pos', JSON.stringify({ x, y }));
}

function clampPanel(x, y) {
  const rect = panel.getBoundingClientRect();
  const maxX = window.innerWidth - rect.width;
  const maxY = window.innerHeight - rect.height;
  return { x: Math.max(0, Math.min(x, maxX)), y: Math.max(0, Math.min(y, maxY)) };
}

function positionDetail() {
  if (!selectedFriend) return;
  const panelRect = panel.getBoundingClientRect();
  const detailRect = detail.getBoundingClientRect();
  const pad = 12;
  const spaceLeft = panelRect.left - pad;
  const spaceRight = window.innerWidth - panelRect.right - pad;
  let useRight = false;
  if (spaceLeft < detailRect.width && spaceRight >= detailRect.width) {
    useRight = true;
  } else if (spaceRight < detailRect.width && spaceLeft >= detailRect.width) {
    useRight = false;
  } else if (spaceRight > spaceLeft) {
    useRight = true;
  }
  let x = useRight ? panelRect.right + pad : panelRect.left - detailRect.width - pad;
  let y = panelRect.top;
  const maxX = window.innerWidth - detailRect.width - pad;
  const maxY = window.innerHeight - detailRect.height - pad;
  x = Math.max(pad, Math.min(x, maxX));
  y = Math.max(pad, Math.min(y, maxY));
  detail.style.left = `${x}px`;
  detail.style.top = `${y}px`;
}

function positionToast() {
  toast.style.left = 'auto';
  toast.style.right = '25px';
  toast.style.top = '25px';
}

function showToast(message, type = 'info') {
  toast.classList.remove('hidden', 'success', 'error', 'info');
  toast.classList.add(type);
  toast.textContent = message;
  positionToast();
  clearTimeout(toastTimer);
  toastTimer = setTimeout(hideToast, 2500);
}

function hideToast() {
  toast.classList.add('hidden');
}


function renderFriends(friends) {
  friendsState = friends || [];
  list.innerHTML = '';

  if (!friendsState.length) {
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');

  const onlineFriends = friendsState.filter(f => f.online);
  const offlineFriends = friendsState.filter(f => !f.online);

  function appendSection(title, items) {
    if (!items.length) return;
    const header = document.createElement('div');
    header.className = 'list-section';
    header.textContent = title;
    list.appendChild(header);

    for (const friend of items) {
      const row = document.createElement('div');
      row.className = 'friend';
      if (selectedFriend && selectedFriend.name === friend.name) row.classList.add('selected');

      const left = document.createElement('div');
      left.className = 'left';
      const nameRow = document.createElement('div');
      nameRow.className = 'name-row';
      const statusDot = document.createElement('span');
      statusDot.className = `status-dot ${friend.online ? 'online' : 'offline'}`;
      const name = document.createElement('div');
      name.className = 'name';
      name.textContent = friend.name;
      const rgb = BLIP_COLOR_RGB[Number(friend.blipColor || 2)] || [239, 68, 68];
      const displayRgb = friend.online ? rgb : [239, 68, 68];
      name.style.color = `rgb(${displayRgb[0]}, ${displayRgb[1]}, ${displayRgb[2]})`;

      row.style.setProperty('--friend-color-soft', `rgba(${displayRgb[0]}, ${displayRgb[1]}, ${displayRgb[2]}, 0.08)`);
      row.style.setProperty('--friend-color-soft-strong', `rgba(${displayRgb[0]}, ${displayRgb[1]}, ${displayRgb[2]}, 0.18)`);
      row.style.setProperty('--friend-color-strong', `rgba(${displayRgb[0]}, ${displayRgb[1]}, ${displayRgb[2]}, 0.9)`);
      if (friend.giftCount && friend.giftCount > 0) {
        const gift = document.createElement('span');
        gift.className = 'gift-indicator';
        gift.textContent = '🎁';
        name.appendChild(gift);
      }
      nameRow.appendChild(statusDot);
      nameRow.appendChild(name);
      left.appendChild(nameRow);

      const actions = document.createElement('div');
      actions.className = 'row-actions';

      if (friend.online) {
        const waypoint = document.createElement('button');
        waypoint.className = 'waypoint-btn';
        waypoint.textContent = '📍';
        waypoint.title = 'Set Waypoint';
        waypoint.addEventListener('click', (e) => {
          e.stopPropagation();
          postNui('setWaypoint', { name: friend.name });
        });
        actions.appendChild(waypoint);
      }

      row.appendChild(left);
      row.appendChild(actions);
      row.addEventListener('pointerdown', (e) => {
        if (e.target.closest('.waypoint-btn')) return;
        selectedFriend = friend;
        confirmModal.classList.add('hidden');
        giftModal.classList.add('hidden');
        renderFriends(friendsState);
        renderDetail();
      });
      list.appendChild(row);
    }
  }

  appendSection('Online', onlineFriends);
  appendSection('Offline', offlineFriends);
}

function renderDetail() {
  if (!selectedFriend) {
    detail.classList.add('hidden');
    return;
  }
  detail.classList.remove('hidden');
  detailName.textContent = selectedFriend.name;
  if (selectedFriend.online && typeof selectedFriend.distance === 'number') {
    detailDistance.textContent = `${selectedFriend.distance} m`;
    detailDistance.classList.remove('distance-green', 'distance-yellow', 'distance-red');
    if (selectedFriend.distance <= 10) {
      detailDistance.classList.add('distance-green');
    } else if (selectedFriend.distance <= 25) {
      detailDistance.classList.add('distance-yellow');
    } else {
      detailDistance.classList.add('distance-red');
    }
    detailDistance.classList.remove('hidden');
  } else {
    detailDistance.textContent = '';
    detailDistance.classList.remove('distance-green', 'distance-yellow', 'distance-red');
    detailDistance.classList.add('hidden');
  }
  setColor(Number(selectedFriend.blipColor || 2), false);
  renderNotes();
  renderGifts();
  renderInventory();
  positionDetail();
}

function renderNotes() {
  notesList.innerHTML = '';
  const notes = selectedFriend && Array.isArray(selectedFriend.notes) ? selectedFriend.notes : [];
  if (!notes.length) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = 'No notes yet.';
    notesList.appendChild(empty);
    return;
  }

  for (const note of notes) {
    const item = document.createElement('div');
    item.className = 'note-item';
    const text = document.createElement('span');
    text.textContent = note;
    const del = document.createElement('button');
    del.className = 'note-delete';
    del.textContent = '✕';
    del.title = 'Delete note';
    del.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!selectedFriend) return;
      postNui('removeNote', { name: selectedFriend.name, note }).then(() => {
        renderDetail();
      });
    });
    item.appendChild(text);
    item.appendChild(del);
    notesList.appendChild(item);
  }
}

function renderGifts() {
  giftList.innerHTML = '';
  const friendGifts = giftsState.filter(g => g.senderName === selectedFriend.name);
  if (!friendGifts.length) {
    const section = giftList.closest('.section');
    if (section) section.classList.add('hidden');
    return;
  }
  const section = giftList.closest('.section');
  if (section) section.classList.remove('hidden');
  for (const gift of friendGifts) {
    const row = document.createElement('div');
    row.className = 'gift-item';
    const left = document.createElement('div');
    left.className = 'gift-left';
    const img = document.createElement('img');
    img.src = gift.image || '';
    img.onerror = () => { img.style.display = 'none'; };
    const text = document.createElement('div');
    text.textContent = `${gift.item} x${gift.amount}`;
    left.appendChild(img);
    left.appendChild(text);
    const claim = document.createElement('button');
    claim.className = 'primary-btn';
    claim.textContent = 'Claim';
    claim.addEventListener('click', () => {
      postNui('claimGift', { giftId: gift.id }).then((res) => {
        if (!res || !res.ok) showGiftError(res?.error || 'Failed to claim gift.');
      });
    });
    row.appendChild(left);
    row.appendChild(claim);
    giftList.appendChild(row);
  }
}

function renderInventory() {
  inventoryEl.innerHTML = '';
  for (const item of inventoryState) {
    const card = document.createElement('div');
    card.className = 'inv-item';
    if (selectedItems.find(x => x.name === item.name)) card.classList.add('selected');
    const img = document.createElement('img');
    img.src = item.image || '';
    img.onerror = () => { img.style.display = 'none'; };
    const label = document.createElement('div');
    label.className = 'label';
    label.textContent = `${item.label} (${item.amount})`;
    card.appendChild(img);
    card.appendChild(label);
    card.addEventListener('click', () => {
      if (!selectedItems.find(x => x.name === item.name)) {
        selectedItems.push({
          name: item.name,
          label: item.label,
          amount: Math.min(1, item.amount),
          max: item.amount
        });
      }
      renderSelectedItems();
      renderInventory();
    });
    inventoryEl.appendChild(card);
  }
}

function renderSelectedItems() {
  selectedList.innerHTML = '';
  if (!selectedItems.length) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = 'No items selected.';
    selectedList.appendChild(empty);
    return;
  }
  for (const item of selectedItems) {
    const row = document.createElement('div');
    row.className = 'selected-item';
    const name = document.createElement('div');
    name.textContent = item.label;
    const input = document.createElement('input');
    input.type = 'number';
    input.min = '1';
    input.max = String(item.max);
    input.value = String(item.amount);
    input.addEventListener('change', () => {
      const val = Math.max(1, Math.min(Number(input.value) || 1, item.max));
      item.amount = val;
      input.value = String(val);
    });
    const remove = document.createElement('button');
    remove.textContent = 'Remove';
    remove.addEventListener('click', () => {
      selectedItems = selectedItems.filter(x => x.name !== item.name);
      renderSelectedItems();
      renderInventory();
    });
    row.appendChild(name);
    row.appendChild(input);
    row.appendChild(remove);
    selectedList.appendChild(row);
  }
}

function showGiftError(message) {
  showToast(message, 'error');
}

window.addEventListener('message', (event) => {
  const { type, visible: uiVisible, friends, gifts, items } = event.data || {};
  if (type === 'toggle') setVisible(Boolean(uiVisible));
  if (type === 'friends') {
    renderFriends(friends);
    if (selectedFriend) selectedFriend = friendsState.find(f => f.name === selectedFriend.name) || null;
    renderDetail();
  }
  if (type === 'gifts') { giftsState = gifts || []; renderDetail(); }
  if (type === 'inventory') { inventoryState = items || []; renderDetail(); }
  if (type === 'giftToast') { showToast(event.data?.message || 'You received a gift.', 'success'); }
});

if (closeBtn) {
  closeBtn.addEventListener('click', () => {
    postNui('close').then((res) => {
      if (!res || res.ok !== true) setVisible(false);
    });
  });
}
giftClose.addEventListener('click', () => giftModal.classList.add('hidden'));
openGiftModalBtn.addEventListener('click', () => {
  if (!selectedFriend) return showGiftError('Select a friend first.');
  giftModal.classList.remove('hidden');
  renderSelectedItems();
  renderInventory();
});
addNoteBtn.addEventListener('click', () => {
  if (!selectedFriend) return;
  const note = (noteInput.value || '').trim();
  if (!note) return;
  postNui('addNote', { name: selectedFriend.name, note }).then(() => {
    noteInput.value = '';
  });
});
removeBtn.addEventListener('click', () => {
  if (!selectedFriend) return;
  confirmMessage.innerHTML = `You're about to remove ${selectedFriend.name}<br><br>Are you sure?`;
  confirmModal.classList.remove('hidden');
});

detailClose.addEventListener('click', () => {
  selectedFriend = null;
  renderDetail();
});

confirmYes.addEventListener('click', () => {
  if (!selectedFriend) return;
  postNui('removeFriend', { name: selectedFriend.name }).then(() => {
    selectedFriend = null;
    renderDetail();
    showToast('Friend removed.', 'info');
    confirmModal.classList.add('hidden');
  });
});

function closeConfirmModal() {
  confirmModal.classList.add('hidden');
}

confirmCancel.addEventListener('click', closeConfirmModal);
confirmClose.addEventListener('click', closeConfirmModal);
sendGiftBtn.addEventListener('click', () => {
  if (!selectedFriend) return showGiftError('Select a friend.');
  if (!selectedItems.length) return showGiftError('Select at least one item.');
  postNui('sendGifts', {
    targetName: selectedFriend.name,
    items: selectedItems.map(item => ({
      item: item.name,
      amount: item.amount
    }))
  }).then((res) => {
    if (!res || !res.ok) return showGiftError(res?.error || 'Failed to send gift.');
    selectedItems = [];
    renderSelectedItems();
    renderInventory();
    giftModal.classList.add('hidden');
    showToast('Gift sent!', 'success');
  });
});

window.addEventListener('keydown', (event) => {
  if (visible && event.key === 'Tab') {
    event.preventDefault();
    return;
  }
  if (event.key === 'Escape' && visible) postNui('close');
});

function beginDrag(clientX, clientY) {
  const rect = panel.getBoundingClientRect();
  dragState = { offsetX: clientX - rect.left, offsetY: clientY - rect.top };
}

function isInteractiveTarget(target) {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest('button, input, textarea, select, option, .color-list, .color-option, .friend, .list, .panel-body, .detail, .notes-input, .gift-list, .color-grid, .actions'));
}

function updateDrag(clientX, clientY) {
  if (!dragState) return;
  const clamped = clampPanel(clientX - dragState.offsetX, clientY - dragState.offsetY);
  panel.style.left = `${clamped.x}px`;
  panel.style.top = `${clamped.y}px`;
  panel.style.right = 'auto';
  positionDetail();
  positionToast();
}

function endDrag() {
  if (!dragState) return;
  const rect = panel.getBoundingClientRect();
  savePosition(rect.left, rect.top);
  dragState = null;
  positionDetail();
  positionToast();
}

function handleDragStart(event) {
  if (!visible) return;
  if (event.button !== undefined && event.button !== 0) return;
  if (isInteractiveTarget(event.target)) return;
  beginDrag(event.clientX, event.clientY);
  if (event.pointerId !== undefined) panel.setPointerCapture(event.pointerId);
  event.preventDefault();
}

if (panelHeader) {
  panelHeader.addEventListener('mousedown', handleDragStart);
  panelHeader.addEventListener('pointerdown', handleDragStart);
}
if (panel) {
  panel.addEventListener('mousedown', handleDragStart);
  panel.addEventListener('pointerdown', handleDragStart);
}

document.addEventListener('mousemove', (event) => updateDrag(event.clientX, event.clientY));
document.addEventListener('pointermove', (event) => updateDrag(event.clientX, event.clientY));

document.addEventListener('mouseup', endDrag);
document.addEventListener('pointerup', endDrag);
document.addEventListener('pointercancel', endDrag);

window.addEventListener('resize', () => {
  positionDetail();
  positionToast();
});

initColorPicker();
