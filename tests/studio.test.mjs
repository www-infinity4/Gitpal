import test from 'node:test';
import assert from 'node:assert/strict';
import {validRepository,composeBuildRequest,responseText,STORY_WRITER_AI} from '../studio.mjs';

test('repository names require exact owner/repo and reject traversal',()=>{
  assert.equal(validRepository('www-infinity4/Gitpal'),true);
  for (const value of ['','Gitpal','a/b/c','../Gitpal','a/../b','a//b','a/b?x=y','https://github.com/a/b']) {
    assert.equal(validRepository(value),false,value);
  }
});
test('requests need deliberate user text and known operation',()=>{
  assert.throws(()=>composeBuildRequest({request:'fix it'}),/twelve/);
  assert.throws(()=>composeBuildRequest({request:'Build a real webpage',task:'delete-wallet'}),/Unknown task/);
  assert.throws(()=>composeBuildRequest({request:'z'.repeat(4001)}),/limit/);
});
test('specific typed fields are included without dropping the original request',()=>{
  const result=composeBuildRequest({request:'Repair GitHub OAuth popup',task:'repair',
    fields:[{name:'Source file',value:'src/login.tsx'},{name:'Test',value:'popup callback'}]});
  assert.match(result,/Repair GitHub OAuth popup/);
  assert.match(result,/Source file.*src\/login.tsx/);
  assert.match(result,/Test.*popup callback/);
});
test('one-click gap prefill requires real checks and forbids silent merge',()=>{
  const request=composeBuildRequest({request:'Complete Cloudflare linkage',task:'cloudflare',includeGaps:true});
  assert.match(request,/Cloudflare/);
  assert.match(request,/Do not merge or deploy until independent gates pass/);
  assert.match(request,/without printing values/);
});
test('oversized composed requests are rejected before provider submission',()=>{
  assert.throws(()=>composeBuildRequest({request:'a'.repeat(3950),includeGaps:true}),/over 4,000/);
});
test('Story Writer adapter reads actual response text, never fabricates a result',()=>{
  assert.equal(responseText({output_text:'Verified message'}),'Verified message');
  assert.equal(responseText({content:[{text:'one'},{text:'two'}]}),'one\ntwo');
  assert.equal(responseText({ok:true}),'');
  assert.match(STORY_WRITER_AI,/\/v1\/chat$/);
});
