import { module, test } from 'qunit';
import htmlToText from '../../../utils/html-to-text';

module('Unit | Utils | htmlToText');

test('it works', function (assert) {
    assert.equal(htmlToText('hello\n\r\n\rthere'), 'hello   there', 'line breaks are replaced with spaces');
    assert.equal(
        htmlToText('hello<script type="crap">debugger;</script>there'),
        'hellothere',
        'script tags are removed'
    );
    assert.equal(
        htmlToText('hello<style bogus="arg">* { color: yellow; }</style>there'),
        'hellothere',
        'style tags are removed'
    );
    assert.equal(htmlToText('hello<!-- TODO: FIXME: ! -->there'), 'hellothere', 'comments are removed');
    assert.equal(htmlToText('<!doctype html>'), '', 'doctype is removed');
    assert.equal(
        htmlToText('&gt;= 7.2 || &lt;= 2.871'),
        '>= 7.2 || <= 2.871',
        'html entities are converted'
    );
    assert.equal(
        htmlToText('hello<br><br><br /><br/><br>there'),
        'hello\n\nthere',
        'never more than two consecutive newlines'
    );
});
