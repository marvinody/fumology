const setView = (view) => {
  localStorage.setItem('view', view);
}

const getView = () => {
  return localStorage.getItem('view') ? localStorage.getItem('view') : 'all';
}

const getChecklist = () => {
  return localStorage.getItem('checklist') ? JSON.parse(localStorage.getItem('checklist')) : [];
}

const shouldShow = (isChecked) => {
  const view = getView();
  if (view === 'all') {
    return true;
  } else if (view === 'owned') {
    return isChecked;
  } else if (view === 'unowned') {
    return !isChecked;
  }
}

const renderChecklist = () => {
  const checklist = getChecklist();
  const $chars = $('.char-full');
  $chars.each(function() {
    const children = $(this).find('.char-container');
    let hasAtLeastOneChildVisible = false;
    // go though each child
    children.each(function() {

      const id = $(this).find('input').attr('id');
      const isChecked = checklist.includes(id);
      const shouldShowChar = shouldShow(isChecked);
      if (shouldShowChar) {
        $(this).show();
        hasAtLeastOneChildVisible = true;
      } else {
        $(this).hide();
      }

    });

    if (hasAtLeastOneChildVisible) {
      $(this).show();
    } else {
      $(this).hide();
    }

  })


}

const loadChecklistIntoUI = () => {
  const checklist = getChecklist();
  checklist.forEach(char => {
    $(`#${char}`).prop('checked', true);
  });
}

$(document).ready(function() {
  // load checklist & update UI
  loadChecklistIntoUI();


  $('.action').click(function(e) {
    const action = $(this).data('action');
    setView(action);
    renderChecklist();

    $('.action').removeClass('active');
    $(this).addClass('active');
  })


  // when .char is clicked, update checklist
  $('.char').click(function() {
    // id of the clicked char is in the for attribute
    const char = $(this).attr('for');
    const checklist = getChecklist();
    const index = checklist.indexOf(char);
    if (index === -1) {
      checklist.push(char);
    } else {
      checklist.splice(index, 1);
    }
    localStorage.setItem('checklist', JSON.stringify(checklist));

    renderChecklist();

  });


});


