export default `<footer class="footer">
  <nav class="footer-nav">
    {{#each links}}
      <button class="link footer-link" data-page="{{target}}">
        {{text}}
      </button>
    {{/each}}
  </nav>
</footer>`;
