from pathlib import Path
import re
root=Path('/mnt/data/work_nox/Films')
css = r'''
/* Fiche film — affiche compacte incrustée dans le cadre */
.nox-film-wrap{min-height:100vh;padding:34px 20px 90px;display:flex;justify-content:center}
.standalone-detail{position:relative;width:min(1000px,92vw);min-height:570px;border-radius:25px;overflow:hidden;background:#111419;border:1px solid #303640;box-shadow:0 30px 100px #000;margin:35px auto 0;padding:42px 44px 45px}
.standalone-detail::before{content:"";position:absolute;inset:0;background:radial-gradient(circle at 72% 22%,#77552d55,transparent 40%);pointer-events:none}
.detail-top{position:relative;z-index:2;display:grid;grid-template-columns:220px minmax(0,1fr);gap:34px;align-items:start}
.detail-art{position:relative;width:220px;height:315px;background:#080a0d;overflow:hidden;border-radius:18px;border:1px solid #343a42;box-shadow:0 18px 45px #0008;display:flex;align-items:center;justify-content:center}
.detail-art img{display:block;width:100%;height:100%;object-fit:contain;object-position:center;border-radius:17px}
.detail-copy{position:relative;z-index:2;min-width:0;padding:8px 0 0}
.eyebrow{font-size:10px;letter-spacing:3px;color:#c9a75e}
.detail-copy h1{font:500 55px Georgia;margin:15px 0;line-height:1.08}
.meta{font-size:15px;color:#b0b5bc;line-height:1.6}
.detail-copy p{color:#9da3aa;line-height:1.7;font-size:16px;margin:18px 0 0}
.actions{display:flex;gap:10px;margin-top:22px}
.primary,.secondary,.round{height:42px;border-radius:12px;padding:0 17px;font-weight:600;cursor:pointer;white-space:nowrap}
.primary{background:#f1d28c;color:#17130a;border:0}.secondary{background:#ffffff0d;color:#fff;border:1px solid #ffffff18}.round{width:46px;padding:0;background:#ffffff0d;color:#fff;border:1px solid #ffffff18}.is-active{border-color:#e8c778!important;color:#f1d28c!important}
.close-link{position:absolute;right:20px;top:18px;z-index:6;width:40px;height:40px;border:0;border-radius:50%;background:#ffffff12;color:#fff;font-size:24px;cursor:pointer}
.detail-player{position:relative;z-index:2;margin-top:28px;border:1px solid #292f36;border-radius:18px;overflow:hidden;background:#080a0d;box-shadow:0 12px 35px #0005}
.detail-player-head{display:flex;align-items:center;justify-content:space-between;padding:12px 15px;border-bottom:1px solid #20252b;background:#111419}.detail-player-head span{font-size:10px;letter-spacing:3px;color:#d0b16c}.detail-player-head small{font-size:11px;color:#737b84}
.detail-player-screen{position:relative;width:100%;aspect-ratio:16/9;background:radial-gradient(circle at center,#252a30,#080a0d 70%);display:flex;align-items:center;justify-content:center;overflow:hidden}
.detail-player-placeholder{position:absolute;inset:0;width:100%;height:100%;border:0;background:transparent;color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;cursor:pointer;font:inherit}.detail-player-placeholder[hidden]{display:none!important}
.detail-player-play{width:58px;height:58px;border-radius:50%;display:grid;place-items:center;background:#f1d28c;color:#17130a;font-size:22px}.detail-player-placeholder span:last-child{font-size:13px;color:#d5d8dc}
.detail-trailer-frame{position:absolute;inset:0;width:100%;height:100%;border:0;background:#000}.detail-trailer-frame[hidden]{display:none!important}
.detail-player-links{position:relative;z-index:2;display:flex;flex-direction:column;gap:18px;margin-top:18px}.player-version h2{margin:0 0 9px;text-align:center;font-size:12px;font-weight:700;letter-spacing:1.5px;color:#fff}.player-version-row{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}.player-link-btn{min-height:38px;border:1px solid #343a42;background:#15181d;color:#fff;border-radius:11px;padding:0 13px;font-size:12px;font-weight:600;cursor:pointer}.player-link-btn:hover{background:#20252c;border-color:#e0c276;color:#f1d28c}.player-empty{display:block;min-height:1px}
.back{display:block;max-width:1000px;width:min(1000px,92vw);margin:0 auto -5px;color:#e8c778;text-decoration:none;font-size:15px}
@media(max-width:700px){
 body.nox-film-page{background:#07090c}
 .nox-film-wrap{padding:0 0 80px}
 .back{width:auto;margin:20px 20px 0;font-size:14px}
 .standalone-detail{width:92vw;min-height:0;margin:25px auto 0;border-radius:25px;padding:30px 20px 38px}
 .detail-top{display:flex;flex-direction:column;gap:22px;align-items:center}
 .detail-art{width:42%;max-width:165px;height:auto;aspect-ratio:2/3;border-radius:16px;box-shadow:0 12px 30px #0008}
 .detail-art img{width:100%;height:100%;border-radius:15px;object-fit:contain}
 .detail-copy{width:100%;padding:0;text-align:left}
 .detail-copy h1{font-size:32px;line-height:1.12;margin:12px 0}
 .meta{font-size:13px;line-height:1.55}
 .detail-copy p{font-size:15px;line-height:1.65;margin-top:16px}
 .actions{gap:8px;align-items:center;width:100%;margin-top:18px}
 .primary,.secondary{height:40px;flex:1 1 0;min-width:0;padding:0 10px;font-size:12px}
 .round{width:40px;height:40px;min-width:40px;font-size:18px}
 .detail-player{margin-top:24px;border-radius:16px}
 .detail-player-head{padding:10px 12px}
 .detail-player-play{width:52px;height:52px;font-size:20px}
 .detail-player-links{gap:16px}
 .player-version-row{grid-template-columns:repeat(3,minmax(0,1fr));gap:7px}
 .player-link-btn{min-height:36px;font-size:11px;padding:0 7px}
 .close-link{right:12px;top:12px;width:40px;height:40px}
}
'''
count=0
for p in root.glob('*.html'):
    s=p.read_text(encoding='utf-8')
    # Replace the entire inline style block (all these generated film pages have one).
    s=re.sub(r'<style>.*?</style>', '<style>'+css+'</style>', s, count=1, flags=re.S)
    # Mark poster class and restructure so poster + copy are side by side, while player spans full card.
    s=s.replace('<div class="detail-art"><img data-film-poster', '<div class="detail-art"><img class="detail-poster" data-film-poster')
    pattern=r'<button class="close-link" id="backButton" aria-label="Fermer">×</button><div class="detail-art">(.*?)</div><div class="detail-copy">(.*?)</div></section>'
    m=re.search(pattern,s,flags=re.S)
    if not m:
        raise RuntimeError(f'Pattern not found: {p}')
    art=m.group(1); copy=m.group(2)
    # split player and links out of copy; keep text/actions in copy
    pm=re.search(r'(<div class="detail-player".*?</div>)(<div class="detail-player-links".*?</div>)$', copy, flags=re.S)
    if not pm:
        raise RuntimeError(f'Player pattern not found: {p}')
    copy_top=copy[:pm.start()]
    player=pm.group(1)
    links=pm.group(2)
    replacement=(f'<button class="close-link" id="backButton" aria-label="Fermer">×</button>'
                 f'<div class="detail-top"><div class="detail-art">{art}</div><div class="detail-copy">{copy_top}</div></div>'
                 f'{player}{links}</section>')
    s=s[:m.start()]+replacement+s[m.end():]
    p.write_text(s,encoding='utf-8')
    count+=1
print('modified',count)
