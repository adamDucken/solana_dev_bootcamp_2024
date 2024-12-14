use anchor_lang::prelude::*;

declare_id!("7zFiQa99TGNVCjxHAkEAchjHs8gNCem8853P2fTVUn9b");

#[program]
pub mod project_1_favorites {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        msg!("Greetings from: {:?}", ctx.program_id);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
