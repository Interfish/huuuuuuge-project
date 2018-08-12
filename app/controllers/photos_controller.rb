class PhotosController < AuthenticatedController

  layout 'home'

  def index
    @photos = Photo.all.order(created_at: :desc)
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

  def show
    params.require(:id)
    @photo = Photo.find(params[:id])
    render json: {
      status: 200,
      msg: 'ok',
      id: @photo.id,
      src: url_for(@photo.image),
      comment: @photo.comment
    }
  end

  def update
    puts params.to_s
    photo = Photo.find(params.require(:id))
    photo.update!(comment: params.require(:comment))
    render json: { status: 200, msg: 'ok'}
  end
end
