class PhotosController < AuthenticatedController

  layout 'home'

  def index
  end

  def create
    params.permit(:image, :comment)
    if params[:image].present?
      photo = Photo.create!
      photo.image.attach(params[:image])
    end
    if params[:comment].present?
    end
    render json: { status: 200, msg: 'ok'}
  end
end
