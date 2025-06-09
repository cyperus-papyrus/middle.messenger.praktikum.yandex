export default `<div class="modal{{#if class}} {{class}}{{/if}}">
    <div class="modal__header">
    {{# if backButton }}
    {{> Button id="btnBack" class="button button-secondary" icon="ArrowBack"}}
    {{/if}}
    {{#if title }}
    <h2 class="modal__title">{{title}}</h2>
    {{/if}}
    </div>
    {{! Body }}

    {{#if form }}
    <form class="modal__body">
      {{> body}}
    </form>
{{ else}}
    <div class="modal__body">
      {{> body}}
    </div>
{{/if}}

    {{! Footer }}
    {{#if footer}}
      <div class="modal__footer">
        {{> footer}}
      </div>
    {{/if}}
</div>`;
