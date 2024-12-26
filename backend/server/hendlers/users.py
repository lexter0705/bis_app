from fastapi import APIRouter
from mnemonic import Mnemonic
from solders.keypair import Keypair
from starlette.responses import JSONResponse

from server.base_includer import user_worker

router = APIRouter(prefix="/users")


@router.post("/login/{phrase}")
async def login(phrase: str):
    mnemo = Mnemonic("english")
    seed = mnemo.to_seed(phrase)
    keypair = Keypair.from_seed(seed[:32])
    if not user_worker.get_user(str(keypair.pubkey())):
        return JSONResponse("error", status_code=403)
    return {"address": str(keypair.pubkey())}


@router.post("/signup/{user_name}")
async def signup(user_name: str):
    mnemo = Mnemonic("english")
    mnemonic = mnemo.generate(strength=128)
    keypair = Keypair.from_seed(mnemo.to_seed(mnemonic)[:32])
    user_worker.insert_new_row({"user_id": str(keypair.pubkey()), "name": user_name, "private_key": str(keypair)})
    response = JSONResponse({"address": str(keypair.pubkey()), "mnemonic": mnemonic}, 200)
    return response