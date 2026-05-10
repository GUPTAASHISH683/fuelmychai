export async function getHealth(req, res, next) {
  try {
    res.status(200).json({
      ok: true,
      service: 'fuel-my-chai-api'
    });
  } catch (error) {
    next(error);
  }
}
