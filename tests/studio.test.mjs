import test from 'node:test';
import assert from 'node:assert/strict';
import {validRepository,composeBuildRequest,responseText,STORY_WRITER_AI,prEvidencePrompt} from '../studio.mjs';

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

test('Oracle PR review is based on bounded real evidence, not invented results',()=>{
  const input=prEvidencePrompt({repository:'www-infinity4/Gitpal',prNumber:12,
    request:'Finish Cloudflare connection',details:{files:[{path:'src/bridge.js',status:'modified',patch:'@@ + tested handler',additions:6,deletions:2}],messages:[{author:'copilot',body:'Waiting for deployment configuration'}]}});
  assert.match(input,/Gitpal PR #12/);
  assert.match(input,/src\/bridge\.js/);
  assert.match(input,/Waiting for deployment configuration/);
  assert.match(input,/Do not output or request secrets/);
  assert.ok(input.length<=13500);
});
test('Oracle review refuses an unverified repository or PR number',()=>{
  assert.throws(()=>prEvidencePrompt({repository:'../Gitpal',prNumber:1}),/Invalid PR/);
  assert.throws(()=>prEvidencePrompt({repository:'www-infinity4/Gitpal',prNumber:0}),/Invalid PR/);
});
