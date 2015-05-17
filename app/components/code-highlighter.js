import Ember from 'ember';
import UiCodeHighlight from 'ui-code-highlight/components/ui-code-highlight';

/* global hljs */

export default UiCodeHighlight.extend({
    classNames: ['code-highlighter'],

    highlighter: Ember.on('didInsertElement', function () {
        var shadowDom = this.$('.shadow-dom').html()
                            .replace(/<\![\-]+\>/gm, '')
                            .trim()
                            .replace(/&nbsp;/g, ' ' )
                            .replace(/&lt;/g, '<')
                            .replace(/&gt;/g, '>'),
            highlight;

        hljs.configure(this.get('configuration'));
        highlight = hljs.highlightAuto(shadowDom);

        // only set DOM if change exists
        if (highlight.value !== this.$('code').html()) {
            this.$('code').html(highlight.value);
        }
    })
});
